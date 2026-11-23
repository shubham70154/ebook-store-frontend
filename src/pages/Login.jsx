
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();
        setError("");

        try {
            const loggedInUser = await login(username, password);

            // Redirect based on user role.
            if (loggedInUser.roles.includes("ADMIN")) {
                navigate("/admin/books");
            } else {
                navigate("/books");
            }

        } catch (error) {

            if (error.response?.status === 401) {
                setError("Invalid username or password");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to login. Please try again."
                );
            }
        }
    };

    return (
        <div className="auth-container">

            <form className="auth-card" onSubmit={handleSubmit}>

                <h2>Login to your account</h2>
                <p></p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <label>Username</label>

                <input
                    type="text"
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                    placeholder="Enter username"
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    placeholder="Enter password"
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="auth-footer">
                    Don't have an account?
                    {" "}
                    <Link to="/register">Register here</Link>
                </div>

            </form>

        </div>
    );
}

export default Login;
