import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { getOrderById } from "../api/orderApi";
import { processPayment } from "../api/paymentApi";
import Payment from "./Payment";

vi.mock("../api/orderApi", () => ({
    getOrderById: vi.fn(),
}));

vi.mock("../api/paymentApi", () => ({
    processPayment: vi.fn(),
}));

const pendingOrder = {
    id: 123,
    status: "PENDING_PAYMENT",
    totalAmount: 42.5,
};

function renderPayment() {
    return render(
        <MemoryRouter initialEntries={["/payment/123"]}>
            <Routes>
                <Route path="/payment/:orderId" element={<Payment />} />
            </Routes>
        </MemoryRouter>
    );
}

describe("Payment page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getOrderById.mockResolvedValue(pendingOrder);
    });

    it("shows a loading message while the order is being fetched", () => {
        getOrderById.mockReturnValue(new Promise(() => {}));

        renderPayment();

        expect(screen.getByText("Loading payment details...")).toBeInTheDocument();
    });

    it("shows the amount and payment choices for a pending order", async () => {
        renderPayment();

        expect(await screen.findByText("Complete Your Payment")).toBeInTheDocument();
        expect(screen.getByText("₹42.50")).toBeInTheDocument();
        expect(screen.getByLabelText("Credit Card")).toBeChecked();
        expect(screen.getByLabelText("Debit Card")).not.toBeChecked();
        expect(screen.getByRole("button", { name: "Pay Now ₹42.50" })).toBeEnabled();
    });

    it("submits the selected payment method and shows success", async () => {
        processPayment.mockResolvedValue({
            status: "SUCCESS",
            paymentMethod: "DEBIT_CARD",
            transactionReference: "txn-123",
        });

        renderPayment();

        fireEvent.click(await screen.findByLabelText("Debit Card"));
        fireEvent.click(screen.getByRole("button", { name: "Pay Now ₹42.50" }));

        expect(processPayment).toHaveBeenCalledWith("123", "DEBIT_CARD");
        expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
        expect(screen.getByText("txn-123")).toBeInTheDocument();
        expect(screen.getByText("PAID")).toBeInTheDocument();
    });

    it("does not offer payment for an order that is not pending", async () => {
        getOrderById.mockResolvedValue({ ...pendingOrder, status: "CANCELLED" });

        renderPayment();

        expect(await screen.findByText("Payment Not Available")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Pay Now/ })).not.toBeInTheDocument();
        expect(processPayment).not.toHaveBeenCalled();
    });

    it("shows the API error when the order cannot be loaded", async () => {
        getOrderById.mockRejectedValue({
            response: { data: { message: "Order not found" } },
        });

        renderPayment();

        expect(await screen.findByText("Order not found")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Back to Books" })).toHaveAttribute("href", "/books");
    });
});
