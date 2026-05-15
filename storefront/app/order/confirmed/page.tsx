import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed — Sandstorm Kenya",
  description: "Thank you for your order. We'll be in touch soon.",
};

interface Props {
  searchParams: Promise<{ id?: string; display?: string }>;
}

export default async function OrderConfirmedPage({ searchParams }: Props) {
  const { id, display } = await searchParams;

  return (
    <main className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          {/* Success icon */}
          <div className="confirmation-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4a5240" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="confirmation-title">Order Confirmed!</h1>

          {display && (
            <p className="confirmation-order-id">Order #{display}</p>
          )}

          <p className="confirmation-message">
            Thank you for shopping with Sandstorm Kenya. Your order has been received
            and our team will contact you shortly with payment details.
          </p>

          {/* What happens next */}
          <div className="confirmation-steps">
            <div className="confirmation-step">
              <span className="confirmation-step__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 17.92z" />
                </svg>
              </span>
              <div>
                <div className="confirmation-step__title">We'll call or WhatsApp you</div>
                <div className="confirmation-step__sub">
                  Our team will reach out within 24 hours with M-Pesa payment details.
                </div>
              </div>
            </div>

            <div className="confirmation-step">
              <span className="confirmation-step__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <div className="confirmation-step__title">Payment confirmed → we ship</div>
                <div className="confirmation-step__sub">
                  Once payment is received, your bag is dispatched from our Nairobi workshop.
                </div>
              </div>
            </div>

            <div className="confirmation-step">
              <span className="confirmation-step__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
              <div>
                <div className="confirmation-step__title">Delivery in 3–5 business days</div>
                <div className="confirmation-step__sub">
                  Free delivery anywhere in Kenya. International orders take 7–14 days.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <Link href="/shop" className="btn btn-filled">
              CONTINUE SHOPPING
            </Link>
            <Link href="/contact" className="btn btn-outline">
              CONTACT US
            </Link>
          </div>

          <p className="confirmation-help">
            Questions?{" "}
            <a href="mailto:customercare@sandstormkenya.com" style={{ color: "var(--color-tan)" }}>
              customercare@sandstormkenya.com
            </a>
            {" "}or{" "}
            <a href="https://wa.me/254700000000" style={{ color: "var(--color-tan)" }} target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
