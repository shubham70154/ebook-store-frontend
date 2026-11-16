import "./App.css";

function App() {

    return (
        <div className="app">

            <header className="navbar">
                <h2>E-Book Store</h2>

                <nav>
                    <a href="/">Home</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </nav>
            </header>

            <main className="home-container">

                <h1>Welcome to E-Book Store</h1>

                <p>
                    Discover your next favourite book.
                    Explore our collection of programming
                    and technology books.
                </p>

                <button>
                    Explore Books
                </button>

            </main>

        </div>
    );
}

export default App;