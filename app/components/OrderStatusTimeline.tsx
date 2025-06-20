"use client";

import { FaCheck, FaClock, FaShippingFast, FaBox, FaTimes } from "react-icons/fa";

interface OrderStatusTimelineProps {
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

export default function OrderStatusTimeline({ status, createdAt, updatedAt }: OrderStatusTimelineProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const steps = [
        {
            id: 'PENDING',
            title: 'Order Placed',
            description: 'Your order has been placed and is waiting for payment',
            icon: FaClock,
            date: createdAt
        },
        {
            id: 'PAID',
            title: 'Payment Confirmed',
            description: 'Payment has been received and confirmed',
            icon: FaCheck,
            date: status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED' ? updatedAt : null
        },
        {
            id: 'SHIPPED',
            title: 'Order Shipped',
            description: 'Your order has been shipped and is on its way',
            icon: FaShippingFast,
            date: status === 'SHIPPED' || status === 'DELIVERED' ? updatedAt : null
        },
        {
            id: 'DELIVERED',
            title: 'Delivered',
            description: 'Your order has been delivered successfully',
            icon: FaBox,
            date: status === 'DELIVERED' ? updatedAt : null
        }
    ];

    const getStepStatus = (stepId: string) => {
        if (status === 'CANCELLED') {
            return stepId === 'PENDING' ? 'completed' : 'inactive';
        }

        const statusOrder = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(status);
        const stepIndex = statusOrder.indexOf(stepId);

        if (stepIndex <= currentIndex) {
            return 'completed';
        } else if (stepIndex === currentIndex + 1) {
            return 'current';
        } else {
            return 'upcoming';
        }
    };

    const getStepStyles = (stepStatus: string) => {
        switch (stepStatus) {
            case 'completed':
                return {
                    container: 'relative',
                    icon: 'bg-green-500 text-white',
                    line: 'bg-green-500',
                    content: 'text-gray-900',
                    date: 'text-green-600'
                };
            case 'current':
                return {
                    container: 'relative',
                    icon: 'bg-blue-500 text-white',
                    line: 'bg-gray-300',
                    content: 'text-gray-900',
                    date: 'text-blue-600'
                };
            case 'upcoming':
                return {
                    container: 'relative',
                    icon: 'bg-gray-300 text-gray-500',
                    line: 'bg-gray-300',
                    content: 'text-gray-500',
                    date: 'text-gray-400'
                };
            default:
                return {
                    container: 'relative',
                    icon: 'bg-gray-300 text-gray-500',
                    line: 'bg-gray-300',
                    content: 'text-gray-500',
                    date: 'text-gray-400'
                };
        }
    };

    if (status === 'CANCELLED') {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                    <FaTimes className="text-red-500 text-xl" />
                    <div>
                        <h4 className="font-semibold text-red-800">Order Cancelled</h4>
                        <p className="text-red-600 text-sm">This order has been cancelled</p>
                        <p className="text-red-500 text-xs mt-1">
                            Cancelled on {formatDate(updatedAt)}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6">Order Status</h3>
            
            <div className="space-y-8">
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(step.id);
                    const styles = getStepStyles(stepStatus);
                    const Icon = step.icon;
                    
                    return (
                        <div key={step.id} className={styles.container}>
                            {/* Connecting Line (except for last step) */}
                            {index < steps.length - 1 && (
                                <div 
                                    className={`absolute left-4 top-8 w-0.5 h-16 ${styles.line}`}
                                />
                            )}
                            
                            <div className="flex items-start gap-4">
                                {/* Step Icon */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.icon}`}>
                                    <Icon className="text-sm" />
                                </div>
                                
                                {/* Step Content */}
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${styles.content}`}>
                                        {step.title}
                                    </h4>
                                    <p className={`text-sm ${styles.content}`}>
                                        {step.description}
                                    </p>
                                    {step.date && (
                                        <p className={`text-xs mt-1 ${styles.date}`}>
                                            {formatDate(step.date)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
