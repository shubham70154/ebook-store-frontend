import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addCartItem } from "../api/cartApi";

function AddToCartButton({ book }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setError("");

            await addCartItem(book.id, 1);

            setMessage("Book added to cart!");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to add this book to your cart."
            );
        } finally {
            setLoading(false);
        }
    };

    const outOfStock = book.availableQuantity <= 0;

    return (
        <div className="add-to-cart-container">
            <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={loading || outOfStock}
            >
                {loading
                    ? "Adding..."
                    : outOfStock
                        ? "Out of Stock"
                        : "Add to Cart"}
            </button>

            {message && (
                <p className="success-message">{message}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
}

export default AddToCartButton;