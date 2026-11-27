import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { registerUser } from "../api/authApi";
import Register from "./Register";

vi.mock("../api/authApi", () => ({
    registerUser: vi.fn(),
}));

function renderRegister() {
    return render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );
}

describe("Registration page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("submits the registration details and shows success", async () => {
        registerUser.mockResolvedValue({});

        renderRegister();

        fireEvent.change(screen.getByPlaceholderText("Enter username"), {
            target: { value: "reader" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter email"), {
            target: { value: "reader@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter password"), {
            target: { value: "secure-password" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(registerUser).toHaveBeenCalledWith({
            username: "reader",
            email: "reader@example.com",
            password: "secure-password",
        });
        expect(await screen.findByText("Registration successful! Please login.")).toBeInTheDocument();
    });

    it("displays the API error when registration fails", async () => {
        registerUser.mockRejectedValue({
            response: { data: { message: "Email is already registered" } },
        });

        renderRegister();

        fireEvent.change(screen.getByPlaceholderText("Enter username"), {
            target: { value: "reader" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter email"), {
            target: { value: "reader@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter password"), {
            target: { value: "secure-password" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(await screen.findByText("Email is already registered")).toBeInTheDocument();
    });

    it("requires a valid email and a password of at least eight characters", () => {
        renderRegister();

        const email = screen.getByPlaceholderText("Enter email");
        const password = screen.getByPlaceholderText("Enter password");

        expect(email).toBeRequired();
        expect(email).toHaveAttribute("type", "email");
        expect(password).toBeRequired();
        expect(password).toHaveAttribute("minlength", "8");
    });
});
