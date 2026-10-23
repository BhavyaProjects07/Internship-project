import {
  ANIMATION_TRIGGER_OPTIONS,
  ANIMATION_PRESET_OPTIONS,
  LOOPING_ANIMATION_OPTIONS,
  EASING_OPTIONS,
  DURATION_OPTIONS,
  DELAY_OPTIONS,
} from "../animation/presets.js";
import { selectField } from "./helpers.js";

export const animationFields = {
  animTrigger: selectField("Animation trigger", ANIMATION_TRIGGER_OPTIONS),
  animPreset: selectField("Entrance animation preset", ANIMATION_PRESET_OPTIONS),
  animLoop: selectField("Looping ambient motion", LOOPING_ANIMATION_OPTIONS),
  animDuration: selectField("Animation duration", DURATION_OPTIONS),
  animDelay: selectField("Animation delay", DELAY_OPTIONS),
  animEasing: selectField("Animation easing", EASING_OPTIONS),
};

export const animationDefaults = {
  animTrigger: "none",
  animPreset: "none",
  animLoop: "none",
  animDuration: 500,
  animDelay: 0,
  animEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
};
