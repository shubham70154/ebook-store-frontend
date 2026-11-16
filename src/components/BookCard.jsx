import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";


function BookCard({ book }) {
    return (
        <div className="book-card">
            {book.coverImageUrl ? (
                <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="book-cover"
                />
            ) : (
                <div className="book-cover-placeholder">
                    No Cover Available
                </div>
            )}

            <div className="book-card-content">
                <h3>{book.title}</h3>
                <p className="book-author">By {book.author}</p>

                <p className="book-category">{book.category}</p>

                <p className="book-price">
                    ₹{Number(book.price).toFixed(2)}
                </p>

                <p className="book-quantity">
                    {book.availableQuantity > 0
                        ? `${book.availableQuantity} available`
                        : "Out of stock"}
                </p>

                <Link to={`/books/${book.id}`} className="details-button">
                    View Details
                </Link>
                
                <AddToCartButton book={book} />
            </div>
        </div>
    );
}

export default BookCard;