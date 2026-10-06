"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function EditorSpotlight() {
  const [demoAlignment, setDemoAlignment] = useState("center");
  const [demoColor, setDemoColor] = useState("#ffffff");
  const [demoTextColor, setDemoTextColor] = useState("#0a0a0a");

  return (
    <section id="editor" className="py-24 sm:py-32 bg-neutral-50/50 border-b border-neutral-200/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Explanatory Copy */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3 font-mono">
              The Gutenberg Experience
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12] [text-wrap:balance]">
              Designed around blocks, built for velocity.
            </h2>
            <p className="mt-6 text-base text-neutral-600 leading-relaxed">
              Every section of your website is an independent modular block. Select, drag to reorder, and tweak copy, typography, and colors directly in the sidebar inspector.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Direct Visual Interaction</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Click any block directly on the canvas to trigger contextual Gutenberg toolbars.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Document Outline & Layers</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Maintain an overhead view of your page structure and reorder with ease.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Device Breakpoint Precision</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Audit responsiveness across desktop, tablet, and smartphone canvases in one click.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/templates"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Launch Builder Studio →
              </Link>
            </div>
          </div>

          {/* Right Column: Luminous Light-Theme Interactive Sandbox */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-900/5">
              {/* Window Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-200/80 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-neutral-900 ml-1">Live Block Sandbox</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-blue-600 font-semibold">
                  <span>● Interactive Sandbox</span>
                </div>
              </div>

              {/* Main Demo Workspace */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
                {/* Simulated Canvas */}
                <div className="md:col-span-7 p-6 flex flex-col justify-center items-center bg-neutral-100/60">
                  <div
                    className={`w-full rounded-xl p-6 transition-all duration-300 border border-neutral-200 shadow-md text-${demoAlignment}`}
                    style={{ backgroundColor: demoColor, color: demoTextColor }}
                  >
                    <span className="inline-block text-[10px] font-mono uppercase tracking-wider opacity-60 mb-2 font-semibold">
                      Selected Block: Hero
                    </span>
                    <h3 className="text-xl font-bold tracking-tight mb-2">
                      Live Canvas Rendering
                    </h3>
                    <p className="text-xs opacity-75 leading-relaxed mb-4">
                      Changes made in the right inspector reflect immediately on this preview block.
                    </p>
                    <div>
                      <span className="inline-block rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs">
                        Call to Action →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Inspector Controls */}
                <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-neutral-200/80 p-5 bg-white space-y-4 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-100">
                    Inspector Controls
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1.5">
                      Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-lg">
                      {["left", "center", "right"].map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => setDemoAlignment(align)}
                          className={`py-1.5 text-center font-medium capitalize rounded-md transition-all ${
                            demoAlignment === align
                              ? "bg-white text-neutral-950 shadow-xs font-semibold"
                              : "text-neutral-500 hover:text-neutral-900"
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1.5">
                      Surface Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Pure White", val: "#ffffff", text: "#0a0a0a" },
                        { label: "Light Blue", val: "#eff6ff", text: "#1e3a8a" },
                        { label: "Warm Stone", val: "#f5f5f4", text: "#1c1917" },
                        { label: "Soft Amber", val: "#fffbeb", text: "#78350f" },
                      ].map((c) => (
                        <button
                          key={c.val}
                          type="button"
                          onClick={() => {
                            setDemoColor(c.val);
                            setDemoTextColor(c.text);
                          }}
                          className={`h-8 rounded-lg border transition-transform ${
                            demoColor === c.val ? "ring-2 ring-blue-600 scale-105 border-transparent shadow-xs" : "border-neutral-200 hover:scale-102"
                          }`}
                          style={{ backgroundColor: c.val }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 font-mono flex items-center justify-between">
                    <span>Target Property</span>
                    <span className="text-blue-600 font-semibold">config.bg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
