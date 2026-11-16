import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../api/cartApi";

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingItemId, setUpdatingItemId] = useState(null);

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

    const handleQuantityChange = async (item, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }

        try {
            setUpdatingItemId(item.id);
            setError("");

            const updatedCart = await updateCartItem(
                item.id,
                newQuantity
            );

            setCart(updatedCart);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update item quantity."
            );
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            setError("");

            await removeCartItem(itemId);

            // Refresh the cart after removing the item.
            await loadCart();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to remove item."
            );
        }
    };

    const handleClearCart = async () => {
        try {
            setError("");

            await clearCart();
            await loadCart();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to clear your cart."
            );
        }
    };

    if (loading) {
        return <p className="status-message">Loading your cart...</p>;
    }

    if (error && !cart) {
        return <p className="error-message">{error}</p>;
    }

    const items = cart?.items || [];

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {items.length === 0 ? (
                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>You haven't added any books yet.</p>

                    <Link to="/books" className="continue-shopping-button">
                        Explore Books
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-layout">
                        <div className="cart-items">
                            {items.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    {item.coverImageUrl ? (
                                        <img
                                            src={item.coverImageUrl}
                                            alt={item.title}
                                            className="cart-item-image"
                                        />
                                    ) : (
                                        <div className="cart-item-image cart-image-placeholder">
                                            No Cover
                                        </div>
                                    )}

                                    <div className="cart-item-details">
                                        <h3>{item.title}</h3>
                                        <p>By {item.author}</p>
                                        <p>{item.category}</p>

                                        <p className="cart-item-price">
                                            ₹{Number(item.unitPrice).toFixed(2)}
                                        </p>

                                        {!item.available && (
                                            <p className="error-text">
                                                Currently unavailable
                                            </p>
                                        )}

                                        <div className="quantity-control">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    !item.available ||
                                                    item.quantity <= 1 ||
                                                    updatingItemId === item.id
                                                }
                                            >
                                                -
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    !item.available ||
                                                    updatingItemId === item.id
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="remove-item-button"
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="cart-line-total">
                                        <strong>
                                            ₹{Number(item.lineTotal).toFixed(2)}
                                        </strong>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
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

                            <p className="summary-note">
                                Final inventory availability will be checked
                                again during checkout.
                            </p>

                            <Link to="/checkout" className="checkout-button">
                                Proceed to Checkout
                            </Link>

                            <button
                                className="clear-cart-button"
                                onClick={handleClearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;