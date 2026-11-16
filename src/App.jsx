import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";


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
        <Link to="/">Books</Link>

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

            <span className="navbar-username">{user?.username}</span>

            <button className="logout-button" onClick={handleLogout}>
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:orderId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
