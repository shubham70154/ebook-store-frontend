
import {
    Routes,
    Route,
    Navigate,
    Link,
    useNavigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";

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

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                E-Book Store
            </Link>

            <nav>
                <Link to="/">Home</Link>
                <Link to="/books">Books</Link>

                {isAuthenticated ? (
                    <>
                        {user?.roles?.includes("CUSTOMER") && (
                            <>
                                <Link to="/cart">Cart</Link>
                                <Link to="/orders">My Orders</Link>
                            </>
                        )}

                        {user?.roles?.includes("ADMIN") && (
                            <Link to="/admin/books">Manage Books</Link>
                        )}

                        <span className="navbar-username">
                            {user?.username}
                        </span>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

function App() {
    return (
        <div className="app">
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetails />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/:orderId" element={<Payment />} />

                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
