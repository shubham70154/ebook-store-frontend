
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCart } from "../api/cartApi";
import { createOrder } from "../api/orderApi";

function Checkout() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");    
    const navigate = useNavigate();

    // Keep the same key if the customer retries a failed request.
    const idempotencyKey = useRef(null);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCart();
            setCart(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load your cart."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
    try {
        setPlacingOrder(true);
        setError("");

        if (!idempotencyKey.current) {
            idempotencyKey.current = crypto.randomUUID();
        }

        const order = await createOrder(idempotencyKey.current);

        // Redirect to payment after successful order creation.
        navigate(`/payment/${order.id}`);

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Unable to create your order. Please try again."
        );
    } finally {
        setPlacingOrder(false);
    }
};

    if (loading) {
        return <p className="status-message">Loading checkout...</p>;
    }

    if (error && !cart) {
        return <p className="error-message">{error}</p>;
    }

    // Show confirmation after successful order creation.
    // if (createdOrder) {
    //     return (
    //         <div className="checkout-page">
    //             <div className="order-success-card">
    //                 <div className="success-icon">✓</div>

    //                 <h1>Order Created Successfully!</h1>

    //                 <p>Your order has been created.</p>

    //                 <div className="order-info">
    //                     <p>
    //                         <strong>Order ID:</strong>{" "}
    //                         {createdOrder.id}
    //                     </p>

    //                     <p>
    //                         <strong>Status:</strong>{" "}
    //                         {createdOrder.status}
    //                     </p>

    //                     <p>
    //                         <strong>Total Amount:</strong>{" "}
    //                         ₹{Number(createdOrder.totalAmount).toFixed(2)}
    //                     </p>

    //                     {createdOrder.reservationExpiresAt && (
    //                         <p>
    //                             <strong>Reservation Expires:</strong>{" "}
    //                             {new Date(
    //                                 createdOrder.reservationExpiresAt
    //                             ).toLocaleString()}
    //                         </p>
    //                     )}
    //                 </div>

    //                 <p className="payment-pending-message">
    //                     Your payment is pending. Continue to the payment
    //                     step to complete your order.
    //                 </p>

    //                 <Link to="/books" className="continue-shopping-button">
    //                     Continue Shopping
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

    const items = cart?.items || [];
    const hasUnavailableItems = items.some(item => !item.available);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <p className="checkout-subtitle">
                Review your order before placing it.
            </p>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {items.length === 0 ? (
                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Add some books before proceeding to checkout.</p>

                    <Link to="/books" className="continue-shopping-button">
                        Explore Books
                    </Link>
                </div>
            ) : (
                <div className="checkout-layout">
                    <div className="checkout-items">
                        <h2>Order Items</h2>

                        {items.map(item => (
                            <div className="checkout-item" key={item.id}>
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

                                {!item.available && (
                                    <p className="error-text">
                                        This book is currently unavailable.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="checkout-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Total Items</span>
                            <span>{cart.totalQuantity}</span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <strong>
                                ₹{Number(cart.subtotal).toFixed(2)}
                            </strong>
                        </div>

                        <div className="summary-total">
                            <span>Total Amount</span>
                            <strong>
                                ₹{Number(cart.subtotal).toFixed(2)}
                            </strong>
                        </div>

                        <button
                            className="place-order-button"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder || hasUnavailableItems}
                        >
                            {placingOrder
                                ? "Creating Order..."
                                : "Place Order"}
                        </button>

                        {hasUnavailableItems && (
                            <p className="error-text">
                                Remove unavailable books before placing
                                your order.
                            </p>
                        )}

                        <Link to="/cart" className="back-to-cart-link">
                            Back to Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;
