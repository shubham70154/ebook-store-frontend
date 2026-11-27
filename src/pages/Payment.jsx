
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getOrderById } from "../api/orderApi";
import { processPayment } from "../api/paymentApi";

function Payment() {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");

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

    const handlePayment = async () => {
        try {
            setProcessing(true);
            setError("");

            const result = await processPayment(
                orderId,
                paymentMethod
            );

            setPayment(result);

            setOrder(currentOrder => ({
                ...currentOrder,
                status: result.status === "SUCCESS"
                    ? "PAID"
                    : currentOrder.status
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

    const paymentSucceeded =
        payment?.status === "SUCCESS" ||
        order.status === "PAID";

    return (
        <div className="payment-page">
            <div className="payment-card">

                <h1>Complete Your Payment</h1>

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

                {paymentSucceeded ? (
                    <div className="payment-result payment-success">
                        <h2>Payment Successful!</h2>

                        <p>Your order has been confirmed.</p>

                        {payment && (
                            <>
                                <p>
                                    <strong>Payment Method:</strong>{" "}
                                    {payment.paymentMethod.replaceAll("_", " ")}
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
                            to="/orders"
                            className="payment-action-link"
                        >
                            View My Orders
                        </Link>
                    </div>
                ) : order.status !== "PENDING_PAYMENT" ? (
                    <div className="payment-result payment-failure">
                        <h2>Payment Not Available</h2>

                        <p>
                            This order cannot be paid because its current
                            status is {order.status}.
                        </p>

                        <Link
                            to="/books"
                            className="payment-action-link"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        

                        <h3>Select Payment Method</h3>

                        <div className="payment-method-options">

                            <label className="payment-method-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CREDIT_CARD"
                                    checked={paymentMethod === "CREDIT_CARD"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    disabled={processing}
                                />

                                <span>Credit Card</span>
                            </label>

                            <label className="payment-method-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="DEBIT_CARD"
                                    checked={paymentMethod === "DEBIT_CARD"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    disabled={processing}
                                />

                                <span>Debit Card</span>
                            </label>

                        </div>

                        <button
                            className="pay-now-button"
                            onClick={handlePayment}
                            disabled={processing}
                        >
                            {processing
                                ? "Processing..."
                                : `Pay Now ₹${Number(order.totalAmount).toFixed(2)}`
                            }
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}

export default Payment;
