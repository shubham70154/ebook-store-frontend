
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/orderApi";

function OrderDetails() {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <p className="status-message">
                Loading order details...
            </p>
        );
    }

    if (error || !order) {
        return (
            <div className="order-details-page">
                <p className="error-message">
                    {error || "Order not found."}
                </p>

                <Link to="/orders">Back to My Orders</Link>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            <Link to="/orders" className="back-link">
                ← Back to My Orders
            </Link>

            <div className="order-details-header">
                <div>
                    <h1>Order #{order.id}</h1>
                    <p>
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>

                <span className={`order-status status-${order.status?.toLowerCase()}`}>
                    {order.status?.replaceAll("_", " ")}
                </span>
            </div>

            <div className="order-details-layout">
                <div className="order-books-section">
                    <h2>Ordered Books</h2>

                    {order.items?.map((item, index) => (
                        <div
                            className="order-book-item"
                            key={item.id ?? `${item.bookId}-${index}`}
                        >
                            <div>
                                <h3>{item.title}</h3>

                                <p>By {item.author}</p>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                                <p>
                                    Unit Price: ₹
                                    {Number(item.unitPrice).toFixed(2)}
                                </p>
                            </div>

                            <strong>
                                ₹{Number(item.lineTotal).toFixed(2)}
                            </strong>
                        </div>
                    ))}
                </div>

                <div className="order-payment-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Order ID</span>
                        <strong>#{order.id}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Order Status</span>
                        <strong>{order.status}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Items</span>
                        <strong>{order.items?.length || 0}</strong>
                    </div>

                    <div className="summary-row order-total">
                        <span>Total Amount</span>
                        <strong>
                            ₹{Number(order.totalAmount).toFixed(2)}
                        </strong>
                    </div>

                    {order.reservationExpiresAt && (
                        <div className="summary-row">
                            <span>Reservation Expires</span>
                            <strong>
                                {formatDate(order.reservationExpiresAt)}
                            </strong>
                        </div>
                    )}

                    {order.status === "PENDING_PAYMENT" && (
                        <Link
                            to={`/payment/${order.id}`}
                            className="pay-order-button"
                        >
                            Proceed to Payment
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
