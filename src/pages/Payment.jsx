
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrderById } from "../api/orderApi";
import { processPayment } from "../api/paymentApi";

function Payment() {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load order details."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (simulateFailure) => {
        try {
            setProcessing(true);
            setError("");

            const result = await processPayment(orderId, simulateFailure);

            setPayment(result);

            setOrder(currentOrder => ({
                ...currentOrder,
                status: result.status === "SUCCESS"
                    ? "PAID"
                    : "PAYMENT_FAILED"
            }));

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to process payment. Please try again."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <p className="status-message">
                Loading payment details...
            </p>
        );
    }

    if (error && !order) {
        return (
            <div className="payment-page">
                <p className="error-message">{error}</p>
                <Link to="/books">Back to Books</Link>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const paymentCompleted =
        order.status === "PAID" ||
        order.status === "PAYMENT_FAILED";

    const paymentSucceeded =
        payment?.status === "SUCCESS" ||
        order.status === "PAID";

    return (
        <div className="payment-page">
            <div className="payment-card">

                <h1>Dummy Payment</h1>

                <p className="payment-subtitle">
                    Complete your order using our test payment options.
                </p>

                <div className="payment-order-info">
                    <div>
                        <span>Order ID</span>
                        <strong>#{order.id}</strong>
                    </div>

                    <div>
                        <span>Order Status</span>
                        <strong>{order.status}</strong>
                    </div>

                    <div>
                        <span>Amount to Pay</span>
                        <strong className="payment-amount">
                            ₹{Number(order.totalAmount).toFixed(2)}
                        </strong>
                    </div>
                </div>

                {error && (
                    <p className="error-message">{error}</p>
                )}

                {paymentCompleted ? (
                    <div
                        className={
                            paymentSucceeded
                                ? "payment-result payment-success"
                                : "payment-result payment-failure"
                        }
                    >
                        <h2>
                            {paymentSucceeded
                                ? "Payment Successful!"
                                : "Payment Failed"}
                        </h2>

                        <p>
                            {paymentSucceeded
                                ? "Your order has been confirmed."
                                : "Your payment could not be completed. The reserved book quantities have been restored."}
                        </p>

                        {payment && (
                            <>
                                <p>
                                    <strong>Payment ID:</strong>{" "}
                                    {payment.id}
                                </p>

                                <p>
                                    <strong>Transaction Reference:</strong>{" "}
                                    {payment.transactionReference}
                                </p>

                                <p>
                                    <strong>Payment Status:</strong>{" "}
                                    {payment.status}
                                </p>
                            </>
                        )}

                        <Link
                            to="/books"
                            className="payment-action-link"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : order.status !== "PENDING_PAYMENT" ? (
                    <div className="payment-result payment-failure">
                        <h2>Payment Not Available</h2>
                        <p>
                            This order cannot be paid because its current
                            status is {order.status}.
                        </p>

                        <Link to="/books" className="payment-action-link">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="dummy-payment-notice">
                            This is a test payment page. No real money
                            will be charged.
                        </div>

                        <button
                            className="pay-now-button"
                            onClick={() => handlePayment(false)}
                            disabled={processing}
                        >
                            {processing
                                ? "Processing..."
                                : `Pay Now ₹${Number(order.totalAmount).toFixed(2)}`}
                        </button>

                        <button
                            className="simulate-failure-button"
                            onClick={() => handlePayment(true)}
                            disabled={processing}
                        >
                            {processing
                                ? "Processing..."
                                : "Simulate Payment Failure"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Payment;
