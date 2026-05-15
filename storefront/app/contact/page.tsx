"use client";

import { useState } from "react";
import type { Metadata } from "next";

const faqs = [
  { q: "Do you ship internationally?", a: "Yes! We ship worldwide. International shipping typically takes 7–14 business days." },
  { q: "What is your returns policy?", a: "We accept returns within 30 days of delivery for items in original, unused condition. Contact us to initiate." },
  { q: "How do I care for my bag?", a: "Brush off dirt with a damp cloth. Re-wax canvas annually. Condition leather with natural balm. Do not machine wash." },
  { q: "What does 'Guaranteed for Life' mean?", a: "If a seam fails, a zip breaks, or hardware corrodes under normal use, we will repair or replace your bag free of charge." },
  { q: "Can I order a customised or branded bag?", a: "Yes. We offer corporate and bespoke orders. Email corporate@sandstormkenya.com for details. Minimum quantities apply." },
  { q: "Which payment methods do you accept?", a: "M-Pesa, Visa, Mastercard, and American Express. All payments are processed securely." },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main>
      {/* Header */}
      <div className="page-header">
        <h1>Get in Touch</h1>
        <p>Have a question about an order, a product, or corporate sales? We'd love to hear from you.</p>
      </div>

      {/* Contact Grid */}
      <section style={{ padding: "64px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

            {/* Form */}
            <div>
              <p className="label-small" style={{ marginBottom: 8 }}>SEND A MESSAGE</p>
              <h2 style={{ marginBottom: 24, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>We'll get back to you</h2>
              <div style={{ width: 40, height: 2, background: "var(--color-tan)", marginBottom: 32 }} />

              {submitted && (
                <div style={{ background: "var(--color-olive)", color: "white", padding: "12px 16px", fontSize: 14, marginBottom: 24, borderRadius: 2 }}>
                  ✓ Message received! We'll be in touch within 24 hours.
                </div>
              )}

              <form id="contact-form" onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label" htmlFor="first-name">First Name *</label>
                    <input className="form-input" id="first-name" type="text" placeholder="John" required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="last-name">Last Name</label>
                    <input className="form-input" id="last-name" type="text" placeholder="Kamau" />
                  </div>
                </div>
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input className="form-input" id="email" type="email" placeholder="john@example.com" required />
                <label className="form-label" htmlFor="phone">Phone / WhatsApp</label>
                <input className="form-input" id="phone" type="tel" placeholder="+254 700 000 000" />
                <label className="form-label" htmlFor="subject">Subject</label>
                <input className="form-input" id="subject" type="text" placeholder="Order enquiry, product question, corporate sales…" />
                <label className="form-label" htmlFor="message">Message *</label>
                <textarea className="form-input form-textarea" id="message" placeholder="Tell us how we can help..." required />
                <button type="submit" className="btn btn-filled" style={{ width: "100%", justifyContent: "center", padding: 15 }}>
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* Info */}
            <div>
              <p className="label-small" style={{ marginBottom: 8 }}>OUR DETAILS</p>
              <h2 style={{ marginBottom: 24, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Reach Us Directly</h2>
              <div style={{ width: 40, height: 2, background: "var(--color-tan)", marginBottom: 32 }} />

              {[
                {
                  label: "Customer Care",
                  content: <><a href="mailto:customercare@sandstormkenya.com" style={{ color: "var(--color-tan)" }}>customercare@sandstormkenya.com</a><br/>We respond within 24 hours, Mon–Fri.</>,
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                },
                {
                  label: "WhatsApp",
                  content: <><a href="https://wa.me/254" style={{ color: "var(--color-tan)" }}>Chat with us on WhatsApp</a><br/>Available day &amp; night for quick questions.</>,
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                },
                {
                  label: "Workshop & Showroom",
                  content: <>Nairobi Industrial Area<br/>Nairobi, Kenya<br/><span style={{ fontSize: 12 }}>Mon–Fri 9am–5pm EAT</span></>,
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                },
                {
                  label: "Corporate Sales",
                  content: <>Looking for branded gifts or bulk orders?<br/><a href="mailto:corporate@sandstormkenya.com" style={{ color: "var(--color-tan)" }}>corporate@sandstormkenya.com</a></>,
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
                },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                  <div style={{ width: 40, height: 40, background: "var(--color-warm-gray)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-dark)", marginBottom: 4 }}>{item.label}</strong>
                    <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.6 }}>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--color-warm-gray)", padding: "64px 0" }} aria-labelledby="faq-heading">
        <div className="container">
          <div className="section-header">
            <p className="label-small">COMMON QUESTIONS</p>
            <h2 id="faq-heading">Frequently Asked</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 48 }}>
            {faqs.map((faq) => (
              <div key={faq.q} style={{ padding: 32, background: "white", borderLeft: "3px solid var(--color-tan)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, fontFamily: "var(--font-sans)", color: "var(--color-dark)" }}>{faq.q}</h4>
                <p style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
