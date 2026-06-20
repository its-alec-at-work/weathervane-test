"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    if (email) {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <section
      data-vane-content="newsletter-section"
      data-vane-content-type="marketing"
      data-vane-content-segment="homepage"
      className="py-20 bg-indigo-600"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get 15% Off Your First Order
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new product
            announcements, and 3D printing tips.
          </p>

          <form
            onSubmit={handleSubmit}
            data-vane-form-type="newsletter"
            data-vane-form-category="marketing"
            data-vane-form-goal="lead-capture"
            data-vane-form-funnel="email-signup"
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                type="submit"
                data-vane-content-click="newsletter-submit"
                className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </div>

            {status === "success" && (
              <p className="mt-4 text-indigo-100">
                Thanks for subscribing! Check your email for your discount code.
              </p>
            )}
          </form>

          <p className="mt-4 text-sm text-indigo-200">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
