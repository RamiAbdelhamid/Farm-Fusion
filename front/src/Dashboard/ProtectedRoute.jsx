import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, requiredRole, userRole, children }) => {
  // لو غير مسجّل دخول → نرجعه على /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // لو محدد requiredRole (مثلاً "Veterinarian") و userRole لا يطابق → رجعه على الصفحة الرئيسية
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // إذا تحقق الشرط → يدخل عادي
  return children;
};

export default ProtectedRoute;
