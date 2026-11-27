import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";

import { getCurrentUser } from "../api/authApi";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api/authApi", () => ({
    getCurrentUser: vi.fn(),
}));

const reader = { username: "reader", roles: ["CUSTOMER"] };

function AuthConsumer() {
    const { user, loading, login, logout, isAuthenticated } = useAuth();
    const [loginError, setLoginError] = useState("");

    const handleLogin = async () => {
        try {
            await login("reader", "secret");
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <div>
            <p>Loading: {String(loading)}</p>
            <p>Authenticated: {String(isAuthenticated)}</p>
            <p>User: {user?.username || "none"}</p>
            {loginError && <p role="alert">{loginError}</p>}
            <button onClick={handleLogin}>Log in</button>
            <button onClick={logout}>Log out</button>
        </div>
    );
}

function renderAuthContext() {
    return render(
        <AuthProvider>
            <AuthConsumer />
        </AuthProvider>
    );
}

describe("AuthContext", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    it("finishes loading without requesting a user when no session exists", async () => {
        renderAuthContext();

        expect(await screen.findByText("Loading: false")).toBeInTheDocument();
        expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
        expect(getCurrentUser).not.toHaveBeenCalled();
    });

    it("restores the user when a saved session is valid", async () => {
        sessionStorage.setItem("authHeader", "Basic saved-session");
        getCurrentUser.mockResolvedValue(reader);

        renderAuthContext();

        expect(await screen.findByText("User: reader")).toBeInTheDocument();
        expect(screen.getByText("Authenticated: true")).toBeInTheDocument();
        expect(screen.getByText("Loading: false")).toBeInTheDocument();
        expect(getCurrentUser).toHaveBeenCalledOnce();
    });

    it("clears an invalid saved session", async () => {
        sessionStorage.setItem("authHeader", "Basic expired-session");
        getCurrentUser.mockRejectedValue(new Error("Session expired"));

        renderAuthContext();

        expect(await screen.findByText("Loading: false")).toBeInTheDocument();
        expect(screen.getByText("User: none")).toBeInTheDocument();
        expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
        expect(sessionStorage.getItem("authHeader")).toBeNull();
    });

    it("stores credentials and updates the context after successful login", async () => {
        getCurrentUser.mockResolvedValue(reader);

        renderAuthContext();
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));

        await waitFor(() => {
            expect(screen.getByText("User: reader")).toBeInTheDocument();
            expect(screen.getByText("Authenticated: true")).toBeInTheDocument();
        });
        expect(sessionStorage.getItem("authHeader")).toBe(
            `Basic ${btoa("reader:secret")}`
        );
    });

    it("clears the session and propagates an error when login fails", async () => {
        getCurrentUser.mockRejectedValue(new Error("Login failed"));
        sessionStorage.setItem("authHeader", "Basic previous-session");

        renderAuthContext();
        await screen.findByText("Loading: false");
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Login failed");
        expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
        expect(sessionStorage.getItem("authHeader")).toBeNull();
    });

    it("clears the user and session on logout", async () => {
        sessionStorage.setItem("authHeader", "Basic saved-session");
        getCurrentUser.mockResolvedValue(reader);

        renderAuthContext();
        await screen.findByText("User: reader");
        fireEvent.click(screen.getByRole("button", { name: "Log out" }));

        expect(screen.getByText("User: none")).toBeInTheDocument();
        expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
        expect(sessionStorage.getItem("authHeader")).toBeNull();
    });
});
