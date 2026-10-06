"use client";

import React from "react";
import { THEME_COLOR_OPTIONS } from "@/lib/theme";

export default function BackgroundProperties({ section, onChange }) {
  const config = section.config || {};
  
  const bgType = config.backgroundType || (config.backgroundColor && config.backgroundColor !== "transparent" ? "color" : "none");

  const updateConfig = (key, value) => {
    onChange(section.id, {
      config: {
        ...config,
        [key]: value
      }
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const newConfig = { ...config, backgroundType: newType };
    
    // Set some safe defaults when switching
    if (newType === "none") {
      newConfig.backgroundColor = "transparent";
      newConfig.backgroundImage = null;
      newConfig.backgroundGradient = null;
    } else if (newType === "color" && !newConfig.backgroundColor) {
      newConfig.backgroundColor = "theme.background";
    } else if (newType === "gradient" && !newConfig.backgroundGradient) {
      newConfig.backgroundGradient = {
        type: "linear",
        angle: 135,
        from: "theme.primary",
        to: "theme.accent"
      };
    } else if (newType === "image" || newType === "image-overlay") {
      const defaultUrl = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";
      
      let imgConfig = newConfig.backgroundImage;
      if (!imgConfig || typeof imgConfig === "string") {
        newConfig.backgroundImage = {
          url: typeof imgConfig === "string" ? imgConfig : defaultUrl,
          position: "center",
          size: "cover",
          repeat: "no-repeat"
        };
      }
      
      if (newType === "image-overlay" && (!newConfig.backgroundOverlay || typeof newConfig.backgroundOverlay === "string")) {
        newConfig.backgroundOverlay = {
          enabled: true,
          color: "#000000",
          opacity: 50
        };
      }
    }

    onChange(section.id, { config: newConfig });
  };

  return (
    <div className="p-5 space-y-4">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
        Background
      </span>
      
      <div>
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
          Type
        </label>
        <select
          value={bgType}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
        >
          <option value="none">None (Transparent)</option>
          <option value="color">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
          <option value="image-overlay">Image + Overlay</option>
        </select>
      </div>

      {bgType === "color" && (
        <div className="pt-2">
          <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
            Color
          </label>
          <div className="flex flex-col gap-2">
            <select
              value={config.backgroundColor?.startsWith("theme.") ? config.backgroundColor : "custom"}
              onChange={(e) => {
                if (e.target.value !== "custom") {
                  updateConfig("backgroundColor", e.target.value);
                }
              }}
              className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
            >
              <option value="custom">Custom Color</option>
              <optgroup label="Theme Colors">
                {THEME_COLOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </optgroup>
            </select>
            
            {!config.backgroundColor?.startsWith("theme.") && config.backgroundColor !== "transparent" && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.backgroundColor || "#ffffff"}
                  onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                  className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                />
                <input
                  type="text"
                  value={config.backgroundColor || "#ffffff"}
                  onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                  className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {bgType === "gradient" && (
        <div className="pt-2 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              Angle (Degrees)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="360"
                value={config.backgroundGradient?.angle ?? 135}
                onChange={(e) => updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", angle: Number(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                value={config.backgroundGradient?.angle ?? 135}
                onChange={(e) => updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", angle: Number(e.target.value) })}
                className="w-16 rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 outline-none focus:border-blue-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              Start Color
            </label>
            <div className="flex flex-col gap-2">
              <select
                value={config.backgroundGradient?.from?.startsWith("theme.") ? config.backgroundGradient.from : "custom"}
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", from: e.target.value });
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
              >
                <option value="custom">Custom Color</option>
                <optgroup label="Theme Colors">
                  {THEME_COLOR_OPTIONS.map((opt) => (
                    <option key={`from-${opt.value}`} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
              </select>
              
              {!config.backgroundGradient?.from?.startsWith("theme.") && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.backgroundGradient?.from || "#ffffff"}
                    onChange={(e) => updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", from: e.target.value })}
                    className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                  />
                  <input
                    type="text"
                    value={config.backgroundGradient?.from || "#ffffff"}
                    onChange={(e) => updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", from: e.target.value })}
                    className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              End Color
            </label>
            <div className="flex flex-col gap-2">
              <select
                value={config.backgroundGradient?.to?.startsWith("theme.") ? config.backgroundGradient.to : "custom"}
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", to: e.target.value });
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
              >
                <option value="custom">Custom Color</option>
                <optgroup label="Theme Colors">
                  {THEME_COLOR_OPTIONS.map((opt) => (
                    <option key={`to-${opt.value}`} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
              </select>
              
              {!config.backgroundGradient?.to?.startsWith("theme.") && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.backgroundGradient?.to || "#ffffff"}
                    onChange={(e) => updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", to: e.target.value })}
                    className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                  />
                  <input
                    type="text"
                    value={config.backgroundGradient?.to || "#ffffff"}
                    onChange={(e) => updateConfig("backgroundGradient", { ...config.backgroundGradient, type: "linear", to: e.target.value })}
                    className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(bgType === "image" || bgType === "image-overlay") && (
        <div className="pt-2 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              Image URL
            </label>
            <input
              type="text"
              value={config.backgroundImage?.url || (typeof config.backgroundImage === 'string' ? config.backgroundImage : "")}
              onChange={(e) => updateConfig("backgroundImage", { ...(typeof config.backgroundImage === 'object' ? config.backgroundImage : {}), url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
                Position
              </label>
              <select
                value={config.backgroundImage?.position || "center"}
                onChange={(e) => updateConfig("backgroundImage", { ...(typeof config.backgroundImage === 'object' ? config.backgroundImage : {}), position: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
                Size
              </label>
              <select
                value={config.backgroundImage?.size || "cover"}
                onChange={(e) => updateConfig("backgroundImage", { ...(typeof config.backgroundImage === 'object' ? config.backgroundImage : {}), size: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
                Repeat
              </label>
              <select
                value={config.backgroundImage?.repeat || "no-repeat"}
                onChange={(e) => updateConfig("backgroundImage", { ...(typeof config.backgroundImage === 'object' ? config.backgroundImage : {}), repeat: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
              >
                <option value="no-repeat">No Repeat</option>
                <option value="repeat">Repeat</option>
                <option value="repeat-x">Repeat X</option>
                <option value="repeat-y">Repeat Y</option>
              </select>
            </div>
          </div>
          
          {bgType === "image-overlay" && (
            <div className="pt-2 border-t border-neutral-100 mt-2">
              <label className="block text-[11px] font-semibold text-neutral-600 mb-2">
                Overlay Settings
              </label>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-medium text-neutral-500 mb-1">
                    Color
                  </label>
                  <div className="flex flex-col gap-2">
                    <select
                      value={config.backgroundOverlay?.color?.startsWith("theme.") ? config.backgroundOverlay.color : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          updateConfig("backgroundOverlay", { ...(typeof config.backgroundOverlay === 'object' ? config.backgroundOverlay : { opacity: 50, enabled: true }), color: e.target.value });
                        }
                      }}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs text-neutral-900 outline-none focus:border-blue-600"
                    >
                      <option value="custom">Custom Color</option>
                      <optgroup label="Theme Colors">
                        {THEME_COLOR_OPTIONS.map((opt) => (
                          <option key={`overlay-${opt.value}`} value={opt.value}>{opt.label}</option>
                        ))}
                      </optgroup>
                    </select>
                    
                    {!config.backgroundOverlay?.color?.startsWith("theme.") && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.backgroundOverlay?.color || "#000000"}
                          onChange={(e) => updateConfig("backgroundOverlay", { ...(typeof config.backgroundOverlay === 'object' ? config.backgroundOverlay : { opacity: 50, enabled: true }), color: e.target.value })}
                          className="h-7 w-8 cursor-pointer rounded border border-neutral-300 p-0"
                        />
                        <input
                          type="text"
                          value={config.backgroundOverlay?.color || "#000000"}
                          onChange={(e) => updateConfig("backgroundOverlay", { ...(typeof config.backgroundOverlay === 'object' ? config.backgroundOverlay : { opacity: 50, enabled: true }), color: e.target.value })}
                          className="flex-1 rounded-lg border border-neutral-300 px-2 py-1.5 text-[11px] font-mono text-neutral-800 outline-none focus:border-blue-600 uppercase"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-neutral-500 mb-1">
                    Opacity ({config.backgroundOverlay?.opacity ?? 50}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.backgroundOverlay?.opacity ?? 50}
                    onChange={(e) => updateConfig("backgroundOverlay", { ...(typeof config.backgroundOverlay === 'object' ? config.backgroundOverlay : { color: "#000000", enabled: true }), opacity: Number(e.target.value) })}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
