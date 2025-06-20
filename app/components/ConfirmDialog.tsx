"use client";

import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "warning" | "danger" | "info";
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    type = "warning"
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case "danger":
                return {
                    icon: "text-red-500",
                    confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
                };
            case "info":
                return {
                    icon: "text-blue-500",
                    confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white",
                };
            default:
                return {
                    icon: "text-yellow-500",
                    confirmBtn: "bg-yellow-600 hover:bg-yellow-700 text-white",
                };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FaExclamationTriangle className={`text-2xl ${colors.icon}`} />
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{message}</p>
                
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-md transition-colors ${colors.confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
