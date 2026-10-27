/**
 * Design Tokens for Visual Website Builder
 * Provides consistent tokens across all visual blocks.
 */

export const FONT_FAMILY_OPTIONS = [
  { label: "Default (System)", value: "inherit" },
  { label: "Inter", value: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" },
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Outfit", value: "Outfit, sans-serif" },
  { label: "DM Sans", value: "'DM Sans', sans-serif" },
  { label: "Geist", value: "var(--font-geist-sans), sans-serif" },
  { label: "Playfair Display (Serif)", value: "'Playfair Display', Georgia, serif" },
  { label: "Merriweather (Serif)", value: "Merriweather, Georgia, serif" },
  { label: "JetBrains Mono (Code)", value: "'JetBrains Mono', var(--font-geist-mono), monospace" },
  { label: "Georgia (Editorial)", value: "Georgia, serif" },
];

export const FONT_WEIGHT_OPTIONS = [
  { label: "Light (300)", value: "300" },
  { label: "Normal (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semibold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

export const ALIGNMENT_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
  { label: "Justify", value: "justify" },
];

export const VERTICAL_ALIGN_OPTIONS = [
  { label: "Top", value: "flex-start" },
  { label: "Center", value: "center" },
  { label: "Bottom", value: "flex-end" },
  { label: "Stretch", value: "stretch" },
];

export const JUSTIFY_CONTENT_OPTIONS = [
  { label: "Start", value: "flex-start" },
  { label: "Center", value: "center" },
  { label: "End", value: "flex-end" },
  { label: "Space Between", value: "space-between" },
  { label: "Space Around", value: "space-around" },
  { label: "Space Evenly", value: "space-evenly" },
];

export const WIDTH_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "25%", value: "25%" },
  { label: "33.33%", value: "33.333%" },
  { label: "50%", value: "50%" },
  { label: "66.66%", value: "66.667%" },
  { label: "75%", value: "75%" },
  { label: "100%", value: "100%" },
];

export const CONTAINER_MAX_WIDTH_OPTIONS = [
  { label: "Full Width (100%)", value: 0 },
  { label: "Narrow (640px)", value: 640 },
  { label: "Compact (768px)", value: 768 },
  { label: "Medium (1024px)", value: 1024 },
  { label: "Standard (1200px)", value: 1200 },
  { label: "Wide (1360px)", value: 1360 },
  { label: "Ultra Wide (1536px)", value: 1536 },
];

export const SPACING_OPTIONS = [
  { label: "0", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "16px", value: "16px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "40px", value: "40px" },
  { label: "48px", value: "48px" },
  { label: "64px", value: "64px" },
  { label: "80px", value: "80px" },
  { label: "96px", value: "96px" },
  { label: "128px", value: "128px" },
  { label: "160px", value: "160px" },
];

export const RADIUS_OPTIONS = [
  { label: "0px (Sharp)", value: 0 },
  { label: "4px (Subtle)", value: 4 },
  { label: "8px (Regular)", value: 8 },
  { label: "12px (Smooth)", value: 12 },
  { label: "16px (Card)", value: 16 },
  { label: "24px (Large)", value: 24 },
  { label: "32px (Pill Soft)", value: 32 },
  { label: "9999px (Full Pill)", value: 9999 },
];

export const BORDER_STYLE_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
  { label: "Double", value: "double" },
];

export const SHADOW_PRESETS = [
  { label: "None", value: "none" },
  { label: "Subtle (sm)", value: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" },
  { label: "Medium (md)", value: "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)" },
  { label: "Elevated (lg)", value: "0 10px 15px -3px rgba(0,0,0,0.09), 0 4px 6px -4px rgba(0,0,0,0.05)" },
  { label: "Floating (xl)", value: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)" },
  { label: "Dramatic (2xl)", value: "0 25px 50px -12px rgba(0,0,0,0.22)" },
  { label: "Glow / Neon Blue", value: "0 0 25px rgba(59, 130, 246, 0.4)" },
  { label: "Glow / Violet", value: "0 0 25px rgba(124, 58, 237, 0.4)" },
  { label: "Glow / Emerald", value: "0 0 25px rgba(16, 185, 129, 0.4)" },
  { label: "Inner Shadow", value: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.08)" },
];

export const HOVER_EFFECT_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Lift (-4px)", value: "lift-sm" },
  { label: "Lift (-8px)", value: "lift-md" },
  { label: "Scale (1.02)", value: "scale-sm" },
  { label: "Scale (1.05)", value: "scale-md" },
  { label: "Glow on Hover", value: "glow" },
  { label: "Border Glow", value: "border-glow" },
];

export const TEXT_TRANSFORM_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

export const ICON_NAMES = [
  "star", "zap", "check", "shield", "rocket", "sparkles", "heart", "globe",
  "layers", "code", "cpu", "chart", "mail", "phone", "lock", "camera",
  "video", "message", "bell", "settings", "download", "shopping-bag", "user",
  "award", "flame", "lightbulb", "compass", "book", "search", "arrow-right",
  "briefcase", "terminal", "package", "credit-card", "tag", "eye"
];

export const ICON_PRESETS = [
  { label: "None", value: "none" },
  ...ICON_NAMES.map((name) => ({
    label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " "),
    value: name,
  })),
];
