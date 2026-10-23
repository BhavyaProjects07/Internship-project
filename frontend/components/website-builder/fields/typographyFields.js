import {
  FONT_FAMILY_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  ALIGNMENT_OPTIONS,
  TEXT_TRANSFORM_OPTIONS,
} from "../tokens/index.js";
import { selectField, numberField, radioField, colorField } from "./helpers.js";

export const typographyFields = {
  fontFamily: selectField("Font family", FONT_FAMILY_OPTIONS),
  fontSize: numberField("Font size (px)", 8, 160),
  fontWeight: selectField("Font weight", FONT_WEIGHT_OPTIONS),
  fontStyle: selectField("Font style", [
    { label: "Normal", value: "normal" },
    { label: "Italic", value: "italic" },
  ]),
  textTransform: selectField("Text transform", TEXT_TRANSFORM_OPTIONS),
  textDecoration: selectField("Text decoration", [
    { label: "None", value: "none" },
    { label: "Underline", value: "underline" },
    { label: "Line through", value: "line-through" },
  ]),
  lineHeight: numberField("Line height", 0.5, 3, 0.1),
  letterSpacing: numberField("Letter spacing (px)", -10, 30, 0.5),
  color: colorField("Text color"),
  textAlign: selectField("Text alignment", ALIGNMENT_OPTIONS),
  gradientText: radioField("Gradient text effect", [
    { label: "Disabled", value: false },
    { label: "Enabled", value: true },
  ]),
  gradientFrom: colorField("Gradient color 1 (From)"),
  gradientTo: colorField("Gradient color 2 (To)"),
};

export const typographyDefaults = {
  fontFamily: "inherit",
  fontSize: 16,
  fontWeight: "400",
  fontStyle: "normal",
  textTransform: "none",
  textDecoration: "none",
  lineHeight: 1.6,
  letterSpacing: 0,
  color: "#171717",
  textAlign: "left",
  gradientText: false,
  gradientFrom: "#4f46e5",
  gradientTo: "#06b6d4",
};
