"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { getConsentStatus, type ConsentStatus } from "./CookieConsent";
import type { WeathervanePayload, WeathervaneConfig } from "weathervane";

const GA_MEASUREMENT_ID = "G-WSJ4T211BJ";

// Guard to prevent multiple event bridge setups
let eventBridgeInitialized = false;

// Extend window with gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Track consent status for GA forwarding
let hasGAConsent = false;

export default function AnalyticsProvider() {
  const initAttempted = useRef(false);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");

  // Check initial consent and listen for changes
  useEffect(() => {
    const currentConsent = getConsentStatus();
    setConsentStatus(currentConsent);
    hasGAConsent = currentConsent === "accepted";

    // Sync weathervane consent when it's ready
    const syncVaneConsent = () => {
      if (window.vane?.isReady?.()) {
        const vaneLevel = currentConsent === "accepted" ? "all" :
                         currentConsent === "declined" ? "essential" : "all";
        window.vane.setConsent(vaneLevel);
      }
    };

    const handleConsentChange = (e: CustomEvent<ConsentStatus>) => {
      const newConsent = e.detail;
      setConsentStatus(newConsent);
      hasGAConsent = newConsent === "accepted";
      console.log(`[Analytics] Consent changed to: ${newConsent}`);

      // Update weathervane consent
      if (window.vane?.isReady?.()) {
        const vaneLevel = newConsent === "accepted" ? "all" : "essential";
        window.vane.setConsent(vaneLevel);
      }
    };

    window.addEventListener("consentChange", handleConsentChange as EventListener);

    // Try to sync consent if vane is already ready
    if (window.vane?.isReady?.()) {
      syncVaneConsent();
    }

    return () => {
      window.removeEventListener("consentChange", handleConsentChange as EventListener);
    };
  }, []);

  // Initialize weathervane
  useEffect(() => {
    if (initAttempted.current || eventBridgeInitialized) {
      return;
    }
    initAttempted.current = true;

    import("weathervane").then(() => {
      console.log("[Analytics] Weathervane 0.8.0 loaded");

      const checkReady = setInterval(() => {
        if (window.vane?.isReady?.() && !eventBridgeInitialized) {
          clearInterval(checkReady);
          console.log("[Analytics] Weathervane ready, setting up event bridge");

          // Sync consent level with weathervane
          const currentConsent = getConsentStatus();
          if (currentConsent === "declined") {
            window.vane.setConsent("essential");
          }

          setupEventBridge();
          eventBridgeInitialized = true;
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(checkReady);
        if (!eventBridgeInitialized) {
          console.warn("[Analytics] Weathervane failed to initialize");
        }
      }, 10000);

      return () => {
        clearInterval(checkReady);
        clearTimeout(timeout);
      };
    }).catch((err) => {
      console.error("[Analytics] Failed to load weathervane:", err);
    });
  }, []);

  // Only render GA scripts if consent is accepted
  const gaAccepted = consentStatus === "accepted";

  return (
    <>
      {/* Google Analytics - only load after consent */}
      {gaAccepted && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname
              });
            `}
          </Script>
        </>
      )}

      {/* Weathervane Configuration - 0.8.0 */}
      <Script id="weathervane-config" strategy="beforeInteractive">
        {`
          window.vaneConfig = {
            debug: true,
            sessionTimeout: 30,

            // Core tracking
            enableAutoPageview: true,
            enableDynamicPageview: true,
            enableContentTracking: true,
            enableLinkTracking: true,
            enableFormTracking: true,
            enableWebVitals: true,

            // New in 0.8.0
            enableErrorTracking: true,
            enableRageClickTracking: true,
            rageClickThreshold: 3,
            rageClickWindow: 1000,

            // Shadow DOM
            trackShadowDom: true,

            // Content settings
            contentExposureLimit: 1000,
            largeContentViewportFill: 0.65,
            formAbandonThreshold: 3000,

            // Privacy (consent managed programmatically)
            consent: 'all',
            privacy: {
              collectDevice: true,
              collectTimezone: true,
              persistClientId: true
            },

            // Sampling (100% for testing)
            sampleRate: 1,
            payloadMode: 'full'
          };
        `}
      </Script>
    </>
  );
}

function setupEventBridge() {
  if (typeof window === "undefined") return;

  window.vane.on(
    "*",
    (payload: WeathervanePayload) => {
      const { event_name, properties, page, engagement } = payload;

      // Always log to console for debugging
      console.log(`[Weathervane] ${event_name}`, payload);

      // Only forward to GA4 if consent was given
      if (hasGAConsent && typeof window.gtag === "function") {
        console.log(`[Weathervane → GA4] ${event_name}`);

        // Get page path safely
        const pagePath = typeof page === "object" && "path" in page ? page.path : "/";
        const pageTitle = typeof page === "object" && "title" in page ? page.title : "";

        // Map weathervane events to GA4
        const ga4Params: Record<string, unknown> = {
          ...flattenProperties(properties as Record<string, unknown>),
          page_path: pagePath,
          page_title: pageTitle,
          scroll_depth: engagement?.scroll_depth,
          time_on_page: engagement?.time_on_page,
        };

        // Special handling for new 0.8.0 events
        switch (event_name) {
          case "web_vitals":
            // Send as separate GA4 events for better reporting
            if (properties.first_contentful_paint) {
              window.gtag("event", "FCP", { value: Math.round(properties.first_contentful_paint as number) });
            }
            if (properties.largest_contentful_paint) {
              window.gtag("event", "LCP", { value: Math.round(properties.largest_contentful_paint as number) });
            }
            if (properties.cumulative_layout_shift) {
              window.gtag("event", "CLS", { value: properties.cumulative_layout_shift });
            }
            if (properties.first_input_delay) {
              window.gtag("event", "FID", { value: Math.round(properties.first_input_delay as number) });
            }
            break;

          case "error":
            window.gtag("event", "exception", {
              description: `${properties.error_type}: ${properties.message}`,
              fatal: false,
            });
            break;

          case "rage_click":
            window.gtag("event", "rage_click", {
              element: `${properties.element_tag}#${properties.element_id || ""}${properties.element_class ? "." + String(properties.element_class).split(" ")[0] : ""}`,
              click_count: properties.click_count,
            });
            break;

          default:
            window.gtag("event", event_name, ga4Params);
        }
      }
    },
    { replay: true }
  );
}

function flattenProperties(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenProperties(value as Record<string, unknown>, newKey)
      );
    } else if (value !== null && value !== undefined) {
      result[newKey] = value;
    }
  }

  return result;
}
