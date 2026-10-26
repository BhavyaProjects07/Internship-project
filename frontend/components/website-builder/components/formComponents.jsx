"use client";

import React, { useState } from "react";
import AnimationWrapper from "../animation/AnimationWrapper.jsx";
import { animationFields, animationDefaults } from "../fields/animationFields.js";
import { spacingFields } from "../fields/boxStyleFields.js";
import {
  textField,
  textareaField,
  radioField,
  colorField,
  numberField,
  responsiveField,
} from "../fields/helpers.js";
import { buildResponsiveStyles } from "../layout/responsiveStyles.js";
import { RenderIcon } from "./icons.jsx";

export const formComponents = {
  // ------------------------------------------------------------------------
  // CONTACT FORM
  // ------------------------------------------------------------------------
  ContactForm: {
    label: "Contact & Lead Form",
    fields: {
      heading: textField("Form title"),
      description: textareaField("Form subtitle"),
      buttonText: textField("Submit button label"),
      accentColor: colorField("Button background color"),
      includePhone: radioField("Include Phone Number input", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      includeSubject: radioField("Include Subject selector", [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ]),
      responsive: responsiveField("Responsive overrides", [
        { name: "paddingY", label: "Vertical padding (px)", type: "number", min: 16, max: 80 },
        { name: "paddingX", label: "Horizontal padding (px)", type: "number", min: 12, max: 60 },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      heading: "Start a Conversation",
      description:
        "Tell us about your project or inquiry. Our engineering team responds within 24 hours.",
      buttonText: "Send Inquiry",
      accentColor: "#4f46e5",
      includePhone: true,
      includeSubject: true,
      marginTop: "16px",
      marginBottom: "28px",
      ...animationDefaults,
    },
    render: function RenderContactForm({
      heading,
      description,
      buttonText,
      accentColor,
      includePhone,
      includeSubject,
      marginTop,
      marginBottom,
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [sent, setSent] = useState(false);

      const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
      };

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          paddingY: "--puck-padding-y",
          paddingX: "--puck-padding-x",
        },
      });

      if (sent) {
        return (
          <div
            style={{
              padding: "48px 32px",
              textAlign: "center",
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: 18,
              marginTop,
              marginBottom,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              <RenderIcon name="check" size={28} color="#ffffff" />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#065f46" }}>
              Message Received
            </h3>
            <p style={{ margin: 0, fontSize: 15, color: "#047857" }}>
              Thank you! We will get back to you shortly.
            </p>
          </div>
        );
      }

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <form
            onSubmit={handleSubmit}
            className={respClass}
            style={{
              padding: "var(--puck-padding-y, 36px) var(--puck-padding-x, 28px)",
              backgroundColor: "#ffffff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
              display: "grid",
              gap: 16,
              marginTop,
              marginBottom,
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            {heading && (
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                {heading}
              </h3>
            )}
            {description && (
              <p style={{ margin: "0 0 8px", fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                {description}
              </p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                gap: 14,
                width: "100%",
              }}
            >
              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155" }}>
                Full Name *
                <input
                  required
                  placeholder="Alex Rivera"
                  style={{
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155" }}>
                Work Email *
                <input
                  required
                  type="email"
                  placeholder="alex@company.com"
                  style={{
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                />
              </label>
            </div>
            {includePhone && (
              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155" }}>
                Phone Number (Optional)
                <input
                  placeholder="+1 (555) 000-0000"
                  style={{
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                />
              </label>
            )}
            {includeSubject && (
              <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155" }}>
                Project Scope / Inquiry Type
                <select
                  style={{
                    padding: "11px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    outline: "none",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  <option>Custom Website Development</option>
                  <option>Brand &amp; UI/UX Design System</option>
                  <option>E-Commerce Architecture</option>
                  <option>General Partnership</option>
                </select>
              </label>
            )}
            <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155" }}>
              Project Details *
              <textarea
                required
                rows={4}
                placeholder="Describe your timeline, goals, and requirements..."
                style={{
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  width: "100%",
                }}
              />
            </label>
            <button
              type="submit"
              style={{
                padding: "14px 24px",
                borderRadius: 10,
                backgroundColor: accentColor || "#4f46e5",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {buttonText}
            </button>
          </form>
        </AnimationWrapper>
      );
    },
  },

  // ------------------------------------------------------------------------
  // NEWSLETTER CAPTURE
  // ------------------------------------------------------------------------
  Newsletter: {
    label: "Newsletter / Email Bar",
    fields: {
      headline: textField("Headline"),
      description: textField("Subtext"),
      buttonText: textField("Button text"),
      placeholder: textField("Input placeholder"),
      guarantee: textField("Privacy guarantee footnote"),
      accentColor: colorField("Button color"),
      responsive: responsiveField("Responsive overrides", [
        { name: "paddingY", label: "Vertical padding (px)", type: "number", min: 16, max: 80 },
        { name: "paddingX", label: "Horizontal padding (px)", type: "number", min: 12, max: 60 },
      ]),
      ...spacingFields,
      ...animationFields,
    },
    defaultProps: {
      headline: "Stay Ahead of Digital Innovation",
      description:
        "Join 15,000+ engineers, designers, and founders getting our weekly architectural teardowns.",
      buttonText: "Subscribe",
      placeholder: "Enter your work email...",
      guarantee: "Zero spam. One-click unsubscribe anytime.",
      accentColor: "#0f172a",
      marginTop: "20px",
      marginBottom: "24px",
      ...animationDefaults,
    },
    render: function RenderNewsletter({
      headline,
      description,
      buttonText,
      placeholder,
      guarantee,
      accentColor,
      marginTop,
      marginBottom,
      responsive,
      animTrigger,
      animPreset,
      animLoop,
      animDuration,
      animDelay,
      animEasing,
    }) {
      const [done, setDone] = useState(false);

      const { className: respClass, css: respCss } = buildResponsiveStyles({
        responsive,
        variableMap: {
          paddingY: "--puck-padding-y",
          paddingX: "--puck-padding-x",
        },
      });

      return (
        <AnimationWrapper
          trigger={animTrigger}
          preset={animPreset}
          loop={animLoop}
          duration={animDuration}
          delay={animDelay}
          easing={animEasing}
          style={{
            padding: "var(--puck-padding-y, 40px) var(--puck-padding-x, 24px)",
            backgroundColor: "#f8fafc",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            textAlign: "center",
            marginTop,
            marginBottom,
            boxSizing: "border-box",
            width: "100%",
          }}
          className={respClass}
        >
          {respCss && <style dangerouslySetInnerHTML={{ __html: respCss }} />}
          <h3 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
            {headline}
          </h3>
          {description && (
            <p
              style={{
                margin: "0 auto 24px",
                maxWidth: 540,
                fontSize: 15,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>
          )}
          {done ? (
            <p style={{ margin: 0, fontWeight: 700, color: "#059669", fontSize: 15 }}>
              &#x2713; You&apos;re on the list! Check your inbox for confirmation.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              style={{
                display: "flex",
                maxWidth: 480,
                margin: "0 auto 12px",
                gap: 8,
                flexWrap: "wrap",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <input
                required
                type="email"
                placeholder={placeholder || "Enter your email..."}
                style={{
                  flex: "1 1 220px",
                  padding: "12px 18px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  backgroundColor: accentColor || "#0f172a",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  flex: "0 0 auto",
                }}
              >
                {buttonText}
              </button>
            </form>
          )}
          {guarantee && (
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{guarantee}</p>
          )}
        </AnimationWrapper>
      );
    },
  },
};
