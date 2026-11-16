import { Routes, Route, Navigate, Link } from "react-router-dom";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Checkout from "./pages/Checkout";

import "./App.css";

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to E-Book Store</h1>
            <p>Discover your next favourite book.</p>

            <Link to="/books">
                <button>Explore Books</button>
            </Link>
        </div>
    );
}

function App() {
    return (
        <div className="app">
            <header className="navbar">
                <h2>E-Book Store</h2>

                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/books">Books</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </nav>
            </header>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
    );
}

export default App;