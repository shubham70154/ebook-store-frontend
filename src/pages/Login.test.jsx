import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Login from "./Login";

vi.mock("../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

const login = vi.fn();

function renderLogin() {
    return render(
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/books" element={<p>Books page</p>} />
                <Route path="/admin/books" element={<p>Admin books page</p>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("Login page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({ login, loading: false });
    });

    it("logs in a customer and redirects to the books page", async () => {
        login.mockResolvedValue({ roles: ["CUSTOMER"] });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText("Enter username"), {
            target: { value: "reader" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter password"), {
            target: { value: "correct-password" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(login).toHaveBeenCalledWith("reader", "correct-password");
        expect(await screen.findByText("Books page")).toBeInTheDocument();
    });

    it("shows a clear message when the credentials are rejected", async () => {
        login.mockRejectedValue({ response: { status: 401 } });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText("Enter username"), {
            target: { value: "reader" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter password"), {
            target: { value: "wrong-password" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Invalid username or password")).toBeInTheDocument();
    });
});
