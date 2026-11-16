import { useEffect, useState } from "react";
import { getAllBooks, searchBooks } from "../api/bookApi";
import BookCard from "../components/BookCard";

function Books() {
    const [books, setBooks] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllBooks();
            setBooks(data);
        } catch (error) {
            setError("Unable to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (!keyword.trim()) {
                await loadBooks();
                return;
            }

            const data = await searchBooks(keyword.trim());
            setBooks(data);
        } catch (error) {
            setError("Unable to search books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="books-page">
            <div className="books-header">
                <div>
                    <h1>Explore Books</h1>                    
                </div>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by title, author or category..."
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                    />

                    <button type="submit">Search</button>
                </form>
            </div>

            {loading && <p className="status-message">Loading books...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && books.length === 0 && (
                <p className="status-message">No books found.</p>
            )}

            {!loading && !error && books.length > 0 && (
                <div className="books-grid">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Books;