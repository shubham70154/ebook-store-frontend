
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "PAID":
                return "status-paid";

            case "PENDING_PAYMENT":
                return "status-pending";

            case "PAYMENT_FAILED":
            case "EXPIRED":
                return "status-failed";

            default:
                return "status-default";
        }
    };

    if (loading) {
        return (
            <p className="status-message">
                Loading your orders...
            </p>
        );
    }

    return (
        <div className="order-history-page">
            <div className="order-history-header">
                <div>
                    <h1>My Orders</h1>
                    
                </div>
                
            </div>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {!error && orders.length === 0 && (
                <div className="empty-orders">
                    <h2>No orders found</h2>                    

                    <Link to="/books" className="continue-shopping-button">
                        Continue Shopping
                    </Link>
                </div>
            )}

            {!error && orders.length > 0 && (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-card-header">
                                <div>
                                    <span className="order-label">
                                        Order ID
                                    </span>
                                    <h3>#{order.id}</h3>
                                </div>

                                <span
                                    className={`order-status ${getStatusClass(order.status)}`}
                                >
                                    {order.status?.replaceAll("_", " ")}
                                </span>
                            </div>

                            <div className="order-card-info">
                                <div>
                                    <span>Order Date</span>
                                    <strong>
                                        {formatDate(order.createdAt)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Total Amount</span>
                                    <strong>
                                        ₹{Number(order.totalAmount).toFixed(2)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Items</span>
                                    <strong>
                                        {order.items?.length || 0}
                                    </strong>
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <Link
                                    to={`/orders/${order.id}`}
                                    className="view-order-button"
                                >
                                    View Order Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
