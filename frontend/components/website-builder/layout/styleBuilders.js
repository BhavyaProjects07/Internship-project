import { SHADOW_PRESETS } from "../tokens/index.js";

/**
 * Builds CSS style object for box models, borders, backgrounds, shadows, and glassmorphism.
 */
export function buildBoxStyle(props = {}) {
  const {
    backgroundColor = "transparent",
    backgroundGradient = false,
    gradientAngle = 135,
    gradientFrom = "#4f46e5",
    gradientTo = "#06b6d4",
    backgroundImage = "",
    backgroundSize = "cover",
    backgroundPosition = "center",
    backdropBlur = 0,
    width = "100%",
    maxWidth = 0,
    minHeight = 0,
    borderStyle = "none",
    borderColor = "#e5e7eb",
    borderWidth = 0,
    borderRadius = 0,
    boxShadow = "none",
    marginTop = "0px",
    marginRight = "0px",
    marginBottom = "0px",
    marginLeft = "0px",
    paddingTop = "0px",
    paddingRight = "0px",
    paddingBottom = "0px",
    paddingLeft = "0px",
  } = props;

  const resolvedBgColor = backgroundColor || "transparent";
  let resolvedBgImage = undefined;

  if (backgroundImage && backgroundGradient) {
    resolvedBgImage = `url("${backgroundImage.replace(/["\\\n\r]/g, "")}"), linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`;
  } else if (backgroundImage) {
    resolvedBgImage = `url("${backgroundImage.replace(/["\\\n\r]/g, "")}")`;
  } else if (backgroundGradient) {
    resolvedBgImage = `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`;
  }

  const resolvedShadow =
    boxShadow === "none"
      ? undefined
      : SHADOW_PRESETS.find((s) => s.value === boxShadow)?.value || (boxShadow !== "none" ? boxShadow : undefined);

  return {
    boxSizing: "border-box",
    width,
    maxWidth: maxWidth > 0 ? `${maxWidth}px` : undefined,
    minHeight: minHeight > 0 ? `${minHeight}px` : undefined,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    backgroundColor: resolvedBgColor,
    backgroundImage: resolvedBgImage,
    backgroundSize: resolvedBgImage ? backgroundSize : undefined,
    backgroundPosition: resolvedBgImage ? backgroundPosition : undefined,
    backgroundRepeat: resolvedBgImage ? "no-repeat" : undefined,
    borderStyle,
    borderColor,
    borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
    borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
    boxShadow: resolvedShadow,
    backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : undefined,
    WebkitBackdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : undefined,
  };
}

/**
 * Builds CSS style object for typography, font weight, line height, colors, and gradients.
 */
export function buildTypographyStyle(props = {}) {
  const {
    fontFamily = "inherit",
    fontSize = 16,
    fontWeight = "400",
    fontStyle = "normal",
    textTransform = "none",
    textDecoration = "none",
    lineHeight = 1.6,
    letterSpacing = 0,
    color = "#171717",
    textAlign = "left",
    gradientText = false,
    gradientFrom = "#4f46e5",
    gradientTo = "#06b6d4",
  } = props;

  const style = {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    color,
    textAlign,
  };

  if (gradientText) {
    style.background = `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;
    style.WebkitBackgroundClip = "text";
    style.WebkitTextFillColor = "transparent";
  }

  return style;
}

/**
 * Combines box model and typography styling.
 */
export function buildElementStyle(props = {}) {
  return {
    ...buildBoxStyle(props),
    ...buildTypographyStyle(props),
  };
}

/**
 * Maps hover effect token to CSS hover classes.
 */
export function getHoverClass(effect) {
  switch (effect) {
    case "lift-sm":
      return "hover-lift-sm";
    case "lift-md":
      return "hover-lift-md";
    case "scale-sm":
      return "hover-scale-sm";
    case "scale-md":
      return "hover-scale-md";
    case "glow":
      return "hover-glow";
    case "border-glow":
      return "hover-border-glow";
    default:
      return "";
  }
}
