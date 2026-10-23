"use client";

import React, { useEffect, useRef, useState } from "react";
import "./animation.css";

/**
 * AnimationWrapper Component
 * Declarative, GPU-accelerated animation wrapper for visual builder components.
 * Supports page load, scroll trigger (IntersectionObserver), and looping animations.
 * Fully respects prefers-reduced-motion and cleans up observers to prevent memory leaks.
 */
export default function AnimationWrapper({
  trigger = "none",
  preset = "none",
  loop = "none",
  duration = 500,
  delay = 0,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  children,
  className = "",
  style = {},
  as = "div",
}) {
  const Component = as;
  const elementRef = useRef(null);

  // If no animation is configured, render plain container/component directly
  const hasEntrance = trigger !== "none" && preset !== "none";
  const hasLoop = loop !== "none";

  // State only needed for scroll-triggered entrance
  const [scrolledVisible, setScrolledVisible] = useState(false);
  const isVisible = trigger !== "scroll" || preset === "none" || scrolledVisible;

  useEffect(() => {
    if (trigger !== "scroll" || preset === "none") {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    let observer = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setScrolledVisible(true);
              if (observer && currentEl) {
                observer.unobserve(currentEl);
              }
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      observer.observe(currentEl);
    } catch {
      // If observer setup fails, fall back to visible
    }

    return () => {
      if (observer && currentEl) {
        try {
          observer.unobserve(currentEl);
          observer.disconnect();
        } catch {
          // ignore cleanup error
        }
      }
    };
  }, [trigger, preset]);

  if (!hasEntrance && !hasLoop) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  // Construct animation classes and styles
  const animClasses = [className];
  const combinedStyle = { ...style };

  if (hasEntrance) {
    animClasses.push("wb-animated-target");
    if (preset !== "none") {
      animClasses.push(`wb-anim-${preset}`);
    }
    combinedStyle.animationDuration = `${duration}ms`;
    combinedStyle.animationDelay = `${delay}ms`;
    combinedStyle.animationTimingFunction = easing;
  }

  if (hasLoop && loop !== "none") {
    animClasses.push(`wb-loop-${loop}`);
  }

  return (
    <Component
      ref={elementRef}
      className={animClasses.filter(Boolean).join(" ")}
      style={combinedStyle}
      data-animate-trigger={trigger}
      data-animate-preset={preset}
      data-animate-state={hasEntrance ? (isVisible ? "visible" : "hidden") : "idle"}
    >
      {children}
    </Component>
  );
}
