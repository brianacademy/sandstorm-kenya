import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout — Sandstorm Kenya",
  description: "Complete your order securely.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
