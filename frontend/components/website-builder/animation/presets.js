/**
 * Animation Presets and Options for the Visual Website Builder
 */

export const ANIMATION_TRIGGER_OPTIONS = [
  { label: "On Page Load", value: "load" },
  { label: "When Scrolled Into View", value: "scroll" },
  { label: "Continuous Looping", value: "loop" },
  { label: "Disabled / Static", value: "none" },
];

export const ANIMATION_PRESET_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Fade In", value: "fade-in" },
  { label: "Fade Up", value: "fade-up" },
  { label: "Fade Down", value: "fade-down" },
  { label: "Slide In Left", value: "slide-left" },
  { label: "Slide In Right", value: "slide-right" },
  { label: "Scale In (Pop)", value: "scale-in" },
  { label: "Zoom In (Smooth)", value: "zoom-in" },
  { label: "Blur to Clear", value: "blur-clear" },
  { label: "Flip In Y", value: "flip-in" },
  { label: "Perspective Tilt In", value: "tilt-in" },
];

export const LOOPING_ANIMATION_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Gentle Float", value: "float" },
  { label: "Soft Pulse", value: "pulse" },
  { label: "Continuous Glow", value: "glow-pulse" },
  { label: "Slow Spin (360°)", value: "spin-slow" },
  { label: "Infinite Marquee (Horizontal)", value: "marquee" },
];

export const EASING_OPTIONS = [
  { label: "Ease Out (Natural)", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { label: "Smooth Spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { label: "Ease In Out", value: "ease-in-out" },
  { label: "Linear", value: "linear" },
];

export const DURATION_OPTIONS = [
  { label: "Fast (300ms)", value: 300 },
  { label: "Normal (500ms)", value: 500 },
  { label: "Smooth (700ms)", value: 700 },
  { label: "Gentle (1000ms)", value: 1000 },
  { label: "Cinematic (1400ms)", value: 1400 },
];

export const DELAY_OPTIONS = [
  { label: "0ms (Immediate)", value: 0 },
  { label: "100ms", value: 100 },
  { label: "200ms", value: 200 },
  { label: "300ms", value: 300 },
  { label: "400ms", value: 400 },
  { label: "500ms", value: 500 },
  { label: "600ms", value: 600 },
  { label: "800ms", value: 800 },
  { label: "1000ms", value: 1000 },
];
