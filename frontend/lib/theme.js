export const DEFAULT_THEME = {
  colors: {
    primary: "#111111",
    secondary: "#525252",
    accent: "#2563eb",
    background: "#ffffff",
    surface: "#f5f5f5",
    text: "#111111",
    mutedText: "#737373",
    border: "#e5e5e5",
    success: "#16a34a",
    warning: "#f59e0b",
    error: "#dc2626"
  }
};

export const THEME_COLOR_OPTIONS = [
  { label: "Primary", value: "theme.primary" },
  { label: "Secondary", value: "theme.secondary" },
  { label: "Accent", value: "theme.accent" },
  { label: "Background", value: "theme.background" },
  { label: "Surface", value: "theme.surface" },
  { label: "Text", value: "theme.text" },
  { label: "Muted Text", value: "theme.mutedText" },
  { label: "Border", value: "theme.border" },
  { label: "Success", value: "theme.success" },
  { label: "Warning", value: "theme.warning" },
  { label: "Error", value: "theme.error" }
];

export function resolveColor(value, theme, fallback = "inherit") {
  if (!value) return fallback;
  
  if (value.startsWith("theme.")) {
    const token = value.split(".")[1];
    const resolved = theme?.colors?.[token] || DEFAULT_THEME.colors[token];
    return resolved || fallback;
  }
  
  return value;
}
