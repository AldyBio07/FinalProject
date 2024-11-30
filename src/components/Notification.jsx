import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const notificationTypes = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 text-green-800 border-green-200",
  },
  error: {
    icon: AlertCircle,
    className: "bg-red-50 text-red-800 border-red-200",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
};

const NotificationContainer = ({ children }) => {
  return (
    <div className="fixed z-50 flex flex-col gap-2 bottom-4 right-4">
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
};

const Notification = ({ message, type = "success", onClose, id }) => {
  const NotificationType = notificationTypes[type];
  const Icon = NotificationType.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`
        flex items-center gap-3 min-w-[300px] max-w-md p-4 
        shadow-lg rounded-lg border ${NotificationType.className}
        backdrop-blur-sm backdrop-filter
      `}
    >
      <Icon className="flex-shrink-0 w-5 h-5" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 transition-colors rounded-full hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export { NotificationContainer, Notification };
