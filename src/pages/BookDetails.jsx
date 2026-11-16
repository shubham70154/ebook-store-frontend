import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookById } from "../api/bookApi";
import AddToCartButton from "../components/AddToCartButton";

function BookDetails() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getBookById(id);
                setBook(data);
            } catch (error) {
                setError(
                    error.response?.status === 404
                        ? "Book not found."
                        : "Unable to load book details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [id]);

    if (loading) {
        return <p className="status-message">Loading book details...</p>;
    }

    if (error) {
        return (
            <div className="status-message">
                <p>{error}</p>
                <Link to="/books">Back to Books</Link>
            </div>
        );
    }

    if (!book) {
        return null;
    }

    return (
        <div className="book-details-page">
            <Link to="/books" className="back-link">
                ← Back to Books
            </Link>

            <div className="book-details-card">
                {book.coverImageUrl ? (
                    <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="book-details-cover"
                    />
                ) : (
                    <div className="book-details-cover book-cover-placeholder">
                        No Cover Available
                    </div>
                )}

                <div className="book-details-content">
                    <h1>{book.title}</h1>
                    <p className="book-author">By {book.author}</p>

                    <p><strong>Category:</strong> {book.category}</p>

                    <h2 className="book-price">
                        ₹{Number(book.price).toFixed(2)}
                    </h2>

                    <p className="book-description">
                        {book.description || "No description available."}
                    </p>

                    <p>
                        <strong>Available quantity:</strong>{" "}
                        {book.availableQuantity}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {book.availableQuantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                    </p>
                    
                    <AddToCartButton book={book} />
                </div>
            </div>
        </div>
    );
}

export default BookDetails;