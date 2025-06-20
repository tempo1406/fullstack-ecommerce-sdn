import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { PaymentRequest } from "@/types/order";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body: PaymentRequest = await request.json();
        const { orderId, amount, paymentMethod } = body;

        if (!orderId || !amount || amount <= 0) {
            return NextResponse.json(
                { error: "Valid order ID and amount are required" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: session.user.id,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        if (order.status === "PAID") {
            return NextResponse.json(
                { error: "Order is already paid" },
                { status: 400 }
            );
        }

        if (order.totalAmount !== amount) {
            return NextResponse.json(
                { error: "Amount mismatch" },
                { status: 400 }
            );
        }

        let paymentResult;

        switch (paymentMethod) {
            case "MOCK":
                paymentResult = await processMockPayment(orderId, amount);
                break;
            case "STRIPE":
                paymentResult = await processStripePayment(orderId, amount);
                break;
            case "PAYOS":
                paymentResult = await processPayOSPayment(orderId, amount);
                break;
            default:
                return NextResponse.json(
                    { error: "Invalid payment method" },
                    { status: 400 }
                );
        }

        if (!paymentResult.success) {
            return NextResponse.json(
                {
                    error: paymentResult.message,
                    success: false,
                    orderId,
                },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                updatedAt: new Date(),
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Payment processed successfully",
            orderId: updatedOrder.id,
            paymentId: paymentResult.paymentId,
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error processing payment:", error);
        return NextResponse.json(
            {
                error: "Payment processing failed",
                success: false,
            },
            { status: 500 }
        );
    }
}

async function processMockPayment(_orderId: string, _amount: number) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
        return {
            success: true,
            paymentId: `mock_payment_${Date.now()}`,
            message: "Mock payment successful",
        };
    } else {
        return {
            success: false,
            message: "Mock payment failed",
        };
    }
}

async function processStripePayment(orderId: string, amount: number) {
    console.log(
        `Processing Stripe payment for order ${orderId}, amount: ${amount}`
    );

    return {
        success: true,
        paymentId: `stripe_payment_${Date.now()}`,
        message: "Stripe payment successful (placeholder)",
    };
}

async function processPayOSPayment(orderId: string, amount: number) {
    console.log(
        `Processing PayOS payment for order ${orderId}, amount: ${amount}`
    );

    return {
        success: true,
        paymentId: `payos_payment_${Date.now()}`,
        message: "PayOS payment successful (placeholder)",
    };
}
