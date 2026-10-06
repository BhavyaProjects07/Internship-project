"use client";

import { useState } from "react";

export default function TestimonialsProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

  const [newTestimonial, setNewTestimonial] = useState({
    quote: "",
    name: "",
    role: "",
    company: "",
  });

  const testimonials = content.testimonials || [];

  const updateContent = (field, value) => {
    onChange(section.id, {
      content: {
        ...content,
        [field]: value,
      },
    });
  };

  const updateConfig = (field, value) => {
    onChange(section.id, {
      config: {
        ...config,
        [field]: value,
      },
    });
  };

  const updateTestimonial = (index, field, value) => {
    const updated = testimonials.map((testimonial, testimonialIndex) =>
      testimonialIndex === index
        ? {
            ...testimonial,
            [field]: value,
          }
        : testimonial
    );

    updateContent("testimonials", updated);
  };

  const addTestimonial = () => {
    if (!newTestimonial.quote.trim() && !newTestimonial.name.trim()) {
      return;
    }

    updateContent("testimonials", [
      ...testimonials,
      {
        id: crypto.randomUUID(),
        ...newTestimonial,
      },
    ]);

    setNewTestimonial({
      quote: "",
      name: "",
      role: "",
      company: "",
    });
  };

  const removeTestimonial = (index) => {
    updateContent(
      "testimonials",
      testimonials.filter((_, testimonialIndex) => testimonialIndex !== index)
    );
  };

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col">
      {/* Header */}
      <div className="border-b border-neutral-200 p-5">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600">
          Block: Testimonials
        </span>

        <h3 className="mt-1 text-base font-bold text-neutral-900">
          Testimonials Settings
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Manage customer testimonials and section appearance.
        </p>
      </div>

      {/* Section Content */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Content
        </span>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Heading
          </label>

          <input
            type="text"
            value={content.heading || ""}
            onChange={(e) =>
              updateContent("heading", e.target.value)
            }
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Testimonials
          </span>

          <span className="text-[11px] text-neutral-400">
            {testimonials.length} item
            {testimonials.length === 1 ? "" : "s"}
          </span>
        </div>

        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id || index}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700">
                Testimonial {index + 1}
              </span>

              <button
                type="button"
                onClick={() => removeTestimonial(index)}
                className="text-xs font-medium text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-neutral-600">
                  Quote
                </label>

                <textarea
                  rows={3}
                  value={testimonial.quote || ""}
                  onChange={(e) =>
                    updateTestimonial(
                      index,
                      "quote",
                      e.target.value
                    )
                  }
                  className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-neutral-600">
                  Name
                </label>

                <input
                  type="text"
                  value={testimonial.name || ""}
                  onChange={(e) =>
                    updateTestimonial(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-neutral-600">
                  Role
                </label>

                <input
                  type="text"
                  value={testimonial.role || ""}
                  onChange={(e) =>
                    updateTestimonial(
                      index,
                      "role",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-neutral-600">
                  Company
                </label>

                <input
                  type="text"
                  value={testimonial.company || ""}
                  onChange={(e) =>
                    updateTestimonial(
                      index,
                      "company",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Testimonial */}
        <div className="rounded-xl border border-dashed border-neutral-300 p-3">
          <span className="mb-3 block text-xs font-semibold text-neutral-700">
            Add Testimonial
          </span>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={newTestimonial.quote}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  quote: e.target.value,
                })
              }
              placeholder="Customer quote"
              className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
            />

            <input
              type="text"
              value={newTestimonial.name}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  name: e.target.value,
                })
              }
              placeholder="Customer name"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
            />

            <input
              type="text"
              value={newTestimonial.role}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  role: e.target.value,
                })
              }
              placeholder="Role"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
            />

            <input
              type="text"
              value={newTestimonial.company}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  company: e.target.value,
                })
              }
              placeholder="Company"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
            />

            <button
              type="button"
              onClick={addTestimonial}
              className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Add Testimonial
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Appearance
        </span>



        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Color
          </label>

          <div className="flex gap-2">
            <input
              type="color"
              value={config.textColor || "#111827"}
              onChange={(e) =>
                updateConfig("textColor", e.target.value)
              }
              className="h-8 w-10 cursor-pointer rounded border border-neutral-300"
            />

            <input
              type="text"
              value={config.textColor || "#111827"}
              onChange={(e) =>
                updateConfig("textColor", e.target.value)
              }
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-mono uppercase outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}