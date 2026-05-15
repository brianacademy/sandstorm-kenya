"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Sandstorm Kenya home">
              <div className="footer__logo-text">
                <span className="brand-name">SAND&amp;STORM</span>
                <span className="brand-sub">KENYA</span>
              </div>
            </Link>
            <p className="footer__tagline">
              Inspired by the beauty of our country and the strength and ingenuity of our people,
              Sandstorm has been making bags in Nairobi for over 20 years.
            </p>
          </div>

          {/* Made By Kenya */}
          <nav aria-label="Made By Kenya links">
            <h3 className="footer__col-title">Made By Kenya</h3>
            <ul className="footer__links">
              <li><Link href="/about">Our Heritage</Link></li>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop">New Arrivals</Link></li>
              <li><Link href="/shop">Best Sellers</Link></li>
              <li><Link href="/about">Corporate Gifting</Link></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h3 className="footer__col-title">Legal</h3>
            <ul className="footer__links">
              <li><Link href="/contact">Privacy</Link></li>
              <li><Link href="/contact">Refunds</Link></li>
              <li><Link href="/contact">Terms of Service</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact">Corporate Sales</Link></li>
              <li><Link href="/contact">Shipping</Link></li>
            </ul>
          </nav>

          {/* Newsletter + Social */}
          <div>
            <h3 className="footer__col-title">Newsletter</h3>
            <p className="footer__newsletter-text">
              Sign up to our monthly newsletter &amp; get 10% off your first order.
            </p>
            <form
              className="footer__email-form"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <input type="email" placeholder="Your e-mail" required aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>

            <h3 className="footer__social-title">Follow Us</h3>
            <p className="footer__social-text">Find us on social media</p>
            <div className="footer__social-grid" role="list" aria-label="Social media">
              {[
                { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { label: "Instagram", path: "M..." },
              ].map(() => null)}
              <a className="social-btn" href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a className="social-btn" href="#" aria-label="Twitter/X"><i className="fab fa-x-twitter" /></a>
              <a className="social-btn" href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a className="social-btn" href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p" /></a>
              <a className="social-btn" href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
              <a className="social-btn" href="#" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://flagcdn.com/w40/ke.png" alt="Kenya" className="flag-icon" />
            <span>Kenya (KE)</span>
            <span>·</span>
            <span>Made By Kenya</span>
          </div>
          <div className="footer__bottom-right">
            © {new Date().getFullYear()} Sandstorm Kenya. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
