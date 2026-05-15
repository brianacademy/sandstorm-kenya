import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Your Bag — Sandstorm Kenya",
  description: "Review your bag and proceed to checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
