"use client";

import { useState, useEffect } from "react";

export type ConsentStatus = "pending" | "accepted" | "declined";

const CONSENT_KEY = "cookie_consent";

export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return "pending";
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "accepted" || stored === "declined") return stored;
  return "pending";
}

export function setConsentStatus(status: "accepted" | "declined") {
  localStorage.setItem(CONSENT_KEY, status);
  // Dispatch event so AnalyticsProvider can react
  window.dispatchEvent(new CustomEvent("consentChange", { detail: status }));
}

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = getConsentStatus();
    setStatus(current);
    // Only show banner if consent is pending
    if (current === "pending") {
      // Small delay for better UX
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setConsentStatus("accepted");
    setStatus("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    setConsentStatus("declined");
    setStatus("declined");
    setVisible(false);
  };

  if (!visible || status !== "pending") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-sm sm:text-base">
          <p className="font-medium mb-1">We value your privacy</p>
          <p className="text-gray-300 text-sm">
            We use cookies and analytics to understand how you use our site and improve your experience.{" "}
            <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
