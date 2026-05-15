import type { Metadata } from "next";
import AccountDashboard from "./AccountDashboard";

export const metadata: Metadata = {
  title: "My Account — Sandstorm Kenya",
  description: "Manage your orders, profile and saved addresses.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountDashboard />;
}
