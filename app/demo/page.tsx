"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Weathervane Demo Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            This page tests advanced tracking features: Shadow DOM, dynamic
            content, personalization, popups, DOM mutations, and 0.8.0 features.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 0.8.0 Tracking Tests */}
        <TrackingTestsSection />

        {/* Shadow DOM Section */}
        <ShadowDOMSection />

        {/* Personalization Section */}
        <PersonalizationSection />

        {/* Dynamic Content Section */}
        <DynamicContentSection />
      </div>

      {/* Popup Components */}
      <DiscountPopup />
      <AIChatBot />
    </div>
  );
}

// ============================================
// 0.8.0 Tracking Tests Section
// ============================================
function TrackingTestsSection() {
  const [webVitals, setWebVitals] = useState<Record<string, number | null>>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
  });
  const [consentLevel, setConsentLevel] = useState<string>("unknown");
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [rageClickCount, setRageClickCount] = useState(0);

  // Listen for web_vitals event
  useEffect(() => {
    const handleVitals = (e: CustomEvent) => {
      const { properties } = e.detail;
      setWebVitals({
        fcp: properties.first_contentful_paint || null,
        lcp: properties.largest_contentful_paint || null,
        cls: properties.cumulative_layout_shift || null,
        fid: properties.first_input_delay || null,
      });
      addLog("web_vitals received");
    };

    const handleError = (e: CustomEvent) => {
      addLog(`error: ${e.detail.properties.message}`);
    };

    const handleRageClick = (e: CustomEvent) => {
      addLog(`rage_click: ${e.detail.properties.click_count} clicks on ${e.detail.properties.element_tag}`);
    };

    const handleConsent = (e: CustomEvent) => {
      addLog(`consent_change: ${e.detail.properties.previous_level} → ${e.detail.properties.new_level}`);
      setConsentLevel(e.detail.properties.new_level);
    };

    window.addEventListener("vane:web_vitals", handleVitals as EventListener);
    window.addEventListener("vane:error", handleError as EventListener);
    window.addEventListener("vane:rage_click", handleRageClick as EventListener);
    window.addEventListener("vane:consent_change", handleConsent as EventListener);

    // Get initial consent level
    if (window.vane?.isReady?.()) {
      setConsentLevel(window.vane.getConsent());
    }

    return () => {
      window.removeEventListener("vane:web_vitals", handleVitals as EventListener);
      window.removeEventListener("vane:error", handleError as EventListener);
      window.removeEventListener("vane:rage_click", handleRageClick as EventListener);
      window.removeEventListener("vane:consent_change", handleConsent as EventListener);
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Error triggers
  const triggerUncaughtError = () => {
    addLog("Triggering uncaught error...");
    setTimeout(() => {
      throw new Error("Test uncaught error from demo page");
    }, 100);
  };

  const triggerPromiseRejection = () => {
    addLog("Triggering unhandled promise rejection...");
    Promise.reject(new Error("Test unhandled promise rejection"));
  };

  const triggerTypeError = () => {
    addLog("Triggering TypeError...");
    setTimeout(() => {
      const obj = null as unknown as { someMethod: () => void };
      obj.someMethod();
    }, 100);
  };

  // Consent controls
  const changeConsent = (level: "all" | "essential" | "none") => {
    if (window.vane?.isReady?.()) {
      window.vane.setConsent(level);
      setConsentLevel(level);
      addLog(`Consent set to: ${level}`);
    }
  };

  // Flush test
  const testFlush = () => {
    if (window.vane?.isReady?.()) {
      const history = window.vane.getHistory();
      addLog(`Event history: ${history.length} events`);
      // Note: flush() would send to a real endpoint
      // For demo, we just show the count
      addLog("flush() would send events via sendBeacon");
    }
  };

  return (
    <section>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-2">
          0.8.0 Features
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Tracking Tests
        </h2>
        <p className="text-gray-600 mt-2">
          Test error tracking, rage clicks, web vitals, consent management, and the flush API.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Error Tracking */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              ⚠️
            </span>
            Error Tracking
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Trigger errors to test the <code className="bg-gray-100 px-1 rounded">error</code> event.
            Check console for the actual errors.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={triggerUncaughtError}
              className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Throw Error
            </button>
            <button
              onClick={triggerPromiseRejection}
              className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Promise Reject
            </button>
            <button
              onClick={triggerTypeError}
              className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              TypeError
            </button>
          </div>
        </div>

        {/* Rage Click Detection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              😤
            </span>
            Rage Click Detection
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Click rapidly (3+ times within 1 second) to trigger a{" "}
            <code className="bg-gray-100 px-1 rounded">rage_click</code> event.
          </p>
          <button
            onClick={() => setRageClickCount((c) => c + 1)}
            className="w-full px-4 py-4 bg-orange-100 text-orange-800 font-medium rounded-lg border-2 border-orange-300 hover:bg-orange-200 transition-colors"
          >
            Click Me Rapidly! ({rageClickCount} clicks)
          </button>
        </div>

        {/* Web Vitals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              📊
            </span>
            Web Vitals
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Captured at page end via <code className="bg-gray-100 px-1 rounded">web_vitals</code> event.
            Navigate away to trigger.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">FCP</div>
              <div className="text-lg font-semibold text-gray-900">
                {webVitals.fcp ? `${Math.round(webVitals.fcp)}ms` : "—"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">LCP</div>
              <div className="text-lg font-semibold text-gray-900">
                {webVitals.lcp ? `${Math.round(webVitals.lcp)}ms` : "—"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">CLS</div>
              <div className="text-lg font-semibold text-gray-900">
                {webVitals.cls !== null ? webVitals.cls.toFixed(3) : "—"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase">FID</div>
              <div className="text-lg font-semibold text-gray-900">
                {webVitals.fid ? `${Math.round(webVitals.fid)}ms` : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Consent Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              🔒
            </span>
            Consent Management
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Change consent level. Emits{" "}
            <code className="bg-gray-100 px-1 rounded">consent_change</code> event.
            Current: <span className="font-semibold">{consentLevel}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => changeConsent("all")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                consentLevel === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => changeConsent("essential")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                consentLevel === "essential"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Essential
            </button>
            <button
              onClick={() => changeConsent("none")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                consentLevel === "none"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              None
            </button>
          </div>
        </div>

        {/* Event Log */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                📋
              </span>
              Event Log
            </h3>
            <div className="flex gap-2">
              <button
                onClick={testFlush}
                className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
              >
                Test flush()
              </button>
              <button
                onClick={() => setEventLog([])}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="font-mono text-sm space-y-1 max-h-48 overflow-y-auto">
            {eventLog.length === 0 ? (
              <div className="text-gray-500">Waiting for events...</div>
            ) : (
              eventLog.map((log, i) => (
                <div key={i} className="text-green-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Shadow DOM Section
// ============================================
function ShadowDOMSection() {
  const shadowHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shadowHostRef.current || shadowHostRef.current.shadowRoot) return;

    // Create open shadow root (weathervane tracks open shadow roots)
    const shadow = shadowHostRef.current.attachShadow({ mode: "open" });

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .shadow-container {
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 1rem;
        color: white;
      }
      .shadow-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      .shadow-card {
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 0.75rem;
        margin-bottom: 1rem;
      }
      .shadow-btn {
        background: white;
        color: #667eea;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .shadow-btn:hover {
        transform: scale(1.05);
      }
    `;
    shadow.appendChild(style);

    // Add content with weathervane tracking attributes
    const container = document.createElement("div");
    container.className = "shadow-container";
    container.innerHTML = `
      <h3 class="shadow-title">Shadow DOM Content</h3>
      <div class="shadow-card"
           data-vane-content="shadow-promo-card"
           data-vane-content-type="promotion"
           data-vane-content-segment="shadow-dom-test">
        <p style="margin-bottom: 1rem;">This content lives inside a Shadow DOM. Weathervane can track elements within open shadow roots!</p>
        <button class="shadow-btn"
                data-vane-content-click="shadow-cta-button">
          Shadow CTA Button
        </button>
      </div>
      <div class="shadow-card"
           data-vane-content="shadow-feature-card"
           data-vane-content-type="feature"
           data-vane-content-segment="shadow-dom-test">
        <p>Another tracked card inside the shadow root. Scroll to trigger content_view events.</p>
      </div>
    `;
    shadow.appendChild(container);
  }, []);

  return (
    <section>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
          Shadow DOM Test
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Web Component with Shadow Root
        </h2>
        <p className="text-gray-600 mt-2">
          Content below is rendered inside an open Shadow DOM. Weathervane
          tracks these elements automatically.
        </p>
      </div>

      {/* Shadow DOM Host */}
      <div ref={shadowHostRef} className="shadow-host" />
    </section>
  );
}

// ============================================
// Personalization Section
// ============================================
function PersonalizationSection() {
  const [segment, setSegment] = useState<"new" | "returning" | "vip">("new");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate detecting user segment after page load
    const timer = setTimeout(() => {
      const segments: Array<"new" | "returning" | "vip"> = [
        "new",
        "returning",
        "vip",
      ];
      const randomSegment = segments[Math.floor(Math.random() * segments.length)];
      setSegment(randomSegment);
      setLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const content = {
    new: {
      title: "Welcome, New Friend!",
      description:
        "Looks like this is your first visit. Here's 20% off your first order!",
      cta: "Claim Welcome Offer",
      color: "from-green-500 to-emerald-600",
    },
    returning: {
      title: "Welcome Back!",
      description:
        "Great to see you again. Check out what's new since your last visit.",
      cta: "See What's New",
      color: "from-blue-500 to-indigo-600",
    },
    vip: {
      title: "VIP Access Unlocked",
      description:
        "As a valued customer, you get early access to our new collection.",
      cta: "Shop VIP Collection",
      color: "from-amber-500 to-orange-600",
    },
  };

  const current = content[segment];

  return (
    <section>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
          Personalization Test
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Dynamic Personalized Content
        </h2>
        <p className="text-gray-600 mt-2">
          Content below changes based on simulated user segment. Tests dynamic
          content tracking.
        </p>
      </div>

      {/* Segment Switcher */}
      <div className="flex gap-2 mb-6">
        {(["new", "returning", "vip"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSegment(s)}
            data-vane-content-click={`segment-switch-${s}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              segment === s
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} User
          </button>
        ))}
      </div>

      {/* Personalized Content */}
      {!loaded ? (
        <div className="bg-gray-200 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-6" />
          <div className="h-12 bg-gray-300 rounded w-40" />
        </div>
      ) : (
        <div
          key={segment}
          data-vane-content={`personalized-banner-${segment}`}
          data-vane-content-type="personalization"
          data-vane-content-segment={`user-${segment}`}
          className={`bg-gradient-to-r ${current.color} rounded-2xl p-8 text-white`}
        >
          <h3 className="text-2xl font-bold mb-2">{current.title}</h3>
          <p className="text-white/90 mb-6">{current.description}</p>
          <button
            data-vane-content-click={`personalized-cta-${segment}`}
            className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {current.cta}
          </button>
        </div>
      )}
    </section>
  );
}

// ============================================
// Dynamic Content Section
// ============================================
function DynamicContentSection() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMoreContent = () => {
    setLoading(true);
    setTimeout(() => {
      const newItems = [
        `dynamic-item-${Date.now()}-1`,
        `dynamic-item-${Date.now()}-2`,
        `dynamic-item-${Date.now()}-3`,
      ];
      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);
    }, 800);
  };

  return (
    <section>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-2">
          DOM Mutation Test
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Dynamically Injected Content
        </h2>
        <p className="text-gray-600 mt-2">
          Click the button to inject new tracked elements. Tests MutationObserver
          detection.
        </p>
      </div>

      <button
        onClick={loadMoreContent}
        disabled={loading}
        data-vane-content-click="load-more-content"
        className="mb-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Loading..." : "Load Dynamic Content"}
      </button>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={item}
            data-vane-content={item}
            data-vane-content-type="dynamic"
            data-vane-content-segment="injected-content"
            data-vane-exposure="500"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fadeIn"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold mb-4">
              {items.indexOf(item) + 1}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Dynamic Card #{index + 1}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              This card was injected after page load. Weathervane detects it via
              MutationObserver.
            </p>
            <button
              data-vane-content-click={`dynamic-card-cta-${index + 1}`}
              className="text-sm text-orange-600 font-medium hover:text-orange-700"
            >
              Learn More →
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Click &quot;Load Dynamic Content&quot; to inject tracked elements
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// Discount Popup
// ============================================
function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem("discount_popup_dismissed")) {
      setDismissed(true);
      return;
    }

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("discount_popup_dismissed", "true");
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        data-vane-content="discount-popup-modal"
        data-vane-content-type="popup"
        data-vane-content-segment="promotional"
        data-vane-exposure="0"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn"
      >
        {/* Header Image */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white text-center">
          <div className="text-6xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold">Wait! Don&apos;t Go!</h3>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Subscribe now and get an exclusive discount on your first order!
          </p>
          <div className="text-4xl font-bold text-pink-600 mb-6">15% OFF</div>

          <form
            data-vane-form-type="popup-signup"
            data-vane-form-category="promotion"
            data-vane-form-goal="email-capture"
            data-vane-form-segment="exit-intent"
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleDismiss();
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button
              type="submit"
              data-vane-content-click="popup-claim-discount"
              className="w-full px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
            >
              Claim My Discount
            </button>
          </form>

          <button
            onClick={handleDismiss}
            data-vane-content-click="popup-dismiss"
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            No thanks, I&apos;ll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AI Chat Bot
// ============================================
function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "bot" | "user"; text: string }>
  >([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Show chat bubble after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        setMessages([
          { role: "bot", text: "Hi there! 👋 Need help choosing the perfect 3D print?" },
        ]);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    // Simulate AI response
    setTyping(true);
    setTimeout(() => {
      const responses = [
        "Great question! Our Portrait Prints are perfect for that. Would you like me to show you some examples?",
        "I'd recommend our Pet Sculpture option - it's one of our best sellers! 🐕",
        "That sounds like a wonderful gift idea! The Family Diorama would be perfect for capturing that moment.",
        "Absolutely! We offer free shipping on orders over $100. Is there anything specific you're looking for?",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: "bot", text: randomResponse }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        data-vane-content-click={open ? "chat-close" : "chat-open"}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}

        {/* Notification dot */}
        {!open && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          data-vane-content="ai-chat-widget"
          data-vane-content-type="chat"
          data-vane-content-segment="support"
          className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h4 className="font-semibold">PhotoPrint Assistant</h4>
                <p className="text-xs text-indigo-200">AI-powered support</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                data-vane-content={`chat-message-${i}`}
                data-vane-content-type="chat-message"
                data-vane-content-segment={msg.role}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            data-vane-form-type="chat"
            data-vane-form-category="support"
            data-vane-form-goal="engagement"
            className="p-4 border-t bg-white"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                data-vane-content-click="chat-send-message"
                className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
