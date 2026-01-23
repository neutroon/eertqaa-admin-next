"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { authService } from "@/services/auth";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // We get the token directly from authService as it's kept in localStorage
  const token = authService.getToken();
  const { socket, isConnected } = useSocket(isAuthenticated);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // console.log("🚀 SocketProvider: Setting up listeners");

    const handleLeadsUpdate = (data?: any) => {
      // console.log("🔄 Real-time update received: Invalidating leads queries", data);

      // Invalidate leads list and stats
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads-stats"] });

      // If a specific lead was updated and we have its ID, invalidate that profile too
      if (data?.leadId || data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["lead-profile", data.leadId || data.id],
        });
      }
    };

    const handleOnlineUsersUpdate = (data?: any) => {
      // Invalidate online users list
      queryClient.invalidateQueries({ queryKey: ["online-users"] });
    };

    const handleNewLead = (data: any) => {
      toast.info("تم استلام عميل جديد", {
        description: data.name || "تفقد قائمة العملاء",
      });
      handleLeadsUpdate();
    };

    const handleLeadClaimed = (data: any) => {
      toast.success(`تم حجز العميل ${data?.name}`, {
        description: data?.lockedBy
          ? `بواسطة ${data.lockedBy}`
          : "تم حجز العميل بنجاح",
      });
      handleLeadsUpdate(data);
    };

    const handleLeadUpdated = (data: any) => {
      toast.info("تم تحديث بيانات العميل", {
        description: data?.name || "تم حفظ التغييرات",
      });
      handleLeadsUpdate(data);
    };

    const handleNewFeedback = (data: any) => {
      toast.info("ملاحظة جديدة", {
        description: data?.name || "تمت إضافة ملاحظة على العميل",
      });
      handleLeadsUpdate(data);
    };

    // Events from backend
    socket.on("new_lead", handleNewLead);
    socket.on("lead_claimed", handleLeadClaimed);
    socket.on("lead_updated", handleLeadUpdated);
    socket.on("new_feedback", handleNewFeedback);
    socket.on("online_users_updated", handleOnlineUsersUpdate);

    return () => {
      // console.log("🧹 SocketProvider: Cleaning up listeners");
      socket.off("new_lead", handleNewLead);
      socket.off("lead_claimed", handleLeadClaimed);
      socket.off("lead_updated", handleLeadUpdated);
      socket.off("new_feedback", handleNewFeedback);
      socket.off("online_users_updated", handleOnlineUsersUpdate);
    };
  }, [socket, isConnected, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
