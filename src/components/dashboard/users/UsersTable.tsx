"use client";

import { useState } from "react";
import { User } from "@/services/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  UserCog, 
  Trash2, 
  UserCheck, 
  UserX,
  ShieldCheck,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  isLoading?: boolean;
}

// Simple Dropdown implementation since Radix had issues
function ActionDropdown({ user, onEdit, onDelete, onToggleStatus }: { 
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-right">
      <Button 
        variant="ghost" 
        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute left-0 mt-2 w-48 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
            >
              <button
                onClick={() => { onEdit(user); setIsOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <UserCog className="h-4 w-4" />
                <span>تعديل البيانات</span>
              </button>
              
              <button
                onClick={() => { onToggleStatus(user); setIsOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                  user.isActive ? "hover:bg-orange-50 hover:text-orange-700" : "hover:bg-green-50 hover:text-green-700"
                )}
              >
                {user.isActive ? (
                  <>
                    <UserX className="h-4 w-4" />
                    <span>تعطيل الحساب</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>تفعيل الحساب</span>
                  </>
                )}
              </button>
              
              <div className="my-1 h-px bg-gray-100" />
              
              <button
                onClick={() => { onDelete(user); setIsOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>حذف المستخدم</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UsersTable({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  isLoading 
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200/50 bg-white overflow-hidden shadow-sm">
      <Table dir="rtl">
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="text-right">المستخدم</TableHead>
            <TableHead className="text-right">الدور</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">تاريخ الانضمام</TableHead>
            <TableHead className="text-right">النشاط</TableHead>
            <TableHead className="text-left w-[80px]">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                لا يوجد مستخدمين لعرضهم
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.role === "ADMIN" ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1 px-2 py-0.5">
                        <ShieldCheck className="h-3 w-3" />
                        مدير
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-2 py-0.5">
                        <Headphones className="h-3 w-3" />
                        وكيل مبيعات
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      نشط
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      غير نشط
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(new Date(user.createdAt), "dd MMMM yyyy", { locale: ar })}
                </TableCell>
                <TableCell>
                  {user.role === "SALES_AGENT" && user.salesAgentProfile && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium text-blue-600">
                        {user.salesAgentProfile._count.assignedLeads}
                      </span>
                      {" عميل مستهدف"}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <ActionDropdown 
                    user={user} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onToggleStatus={onToggleStatus} 
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
