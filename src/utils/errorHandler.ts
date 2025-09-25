import { ApiError } from "@/config/api";

export interface ErrorInfo {
  message: string;
  type: "network" | "validation" | "auth" | "server" | "unknown";
  canRetry: boolean;
}

export function handleApiError(error: any): ErrorInfo {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 0:
        return {
          message:
            "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
          type: "network",
          canRetry: true,
        };

      case 400:
        return {
          message:
            error.message ||
            "البيانات المدخلة غير صحيحة. يرجى المراجعة والمحاولة مرة أخرى.",
          type: "validation",
          canRetry: true,
        };

      case 401:
        return {
          message: "انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى.",
          type: "auth",
          canRetry: false,
        };

      case 403:
        return {
          message: "ليس لديك صلاحية للوصول إلى هذا المورد.",
          type: "auth",
          canRetry: false,
        };

      case 404:
        return {
          message: "المورد المطلوب غير موجود.",
          type: "server",
          canRetry: false,
        };

      case 422:
        return {
          message: "البيانات المدخلة غير صالحة. يرجى التحقق من المعلومات.",
          type: "validation",
          canRetry: true,
        };

      case 429:
        return {
          message:
            "تم تجاوز عدد المحاولات المسموحة. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
          type: "server",
          canRetry: true,
        };

      case 500:
        return {
          message: "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.",
          type: "server",
          canRetry: true,
        };

      case 502:
      case 503:
      case 504:
        return {
          message: "الخادم غير متاح حالياً. يرجى المحاولة لاحقاً.",
          type: "server",
          canRetry: true,
        };

      default:
        return {
          message:
            error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
          type: "unknown",
          canRetry: true,
        };
    }
  }

  // Handle network errors
  if (error.name === "AbortError") {
    return {
      message: "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
      type: "network",
      canRetry: true,
    };
  }

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      message: "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.",
      type: "network",
      canRetry: true,
    };
  }

  // Generic error
  return {
    message: error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    type: "unknown",
    canRetry: true,
  };
}

export function getValidationErrors(error: ApiError): Record<string, string> {
  if (error.error) {
    // Return a simple error object with the error code as the message
    return {
      general: error.error.code || error.message,
    };
  }

  return {};
}
