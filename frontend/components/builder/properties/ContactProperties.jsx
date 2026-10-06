"use client";

export default function ContactProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

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

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col">
      {/* Header */}
      <div className="border-b border-neutral-200 p-5">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600">
          Block: Contact
        </span>

        <h3 className="mt-1 text-base font-bold text-neutral-900">
          Contact Settings
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Manage contact information, call-to-action, and appearance.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Content
        </span>

        {/* Eyebrow */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Eyebrow
          </label>

          <input
            type="text"
            value={content.eyebrow || ""}
            onChange={(e) =>
              updateContent("eyebrow", e.target.value)
            }
            placeholder="Get in touch"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        {/* Heading */}
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
            placeholder="Let's work together."
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Description
          </label>

          <textarea
            rows={3}
            value={content.description || ""}
            onChange={(e) =>
              updateContent("description", e.target.value)
            }
            placeholder="Tell visitors how they can contact you."
            className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Contact Information
        </span>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Email
          </label>

          <input
            type="email"
            value={content.email || ""}
            onChange={(e) =>
              updateContent("email", e.target.value)
            }
            placeholder="hello@example.com"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Phone
          </label>

          <input
            type="text"
            value={content.phone || ""}
            onChange={(e) =>
              updateContent("phone", e.target.value)
            }
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        {/* Address */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Address
          </label>

          <textarea
            rows={2}
            value={content.address || ""}
            onChange={(e) =>
              updateContent("address", e.target.value)
            }
            placeholder="Your business address"
            className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Call To Action
        </span>

        {/* Button Text */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Button Text
          </label>

          <input
            type="text"
            value={content.buttonText || ""}
            onChange={(e) =>
              updateContent("buttonText", e.target.value)
            }
            placeholder="Send a Message"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>

        {/* Button Link */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Button Link
          </label>

          <input
            type="text"
            value={content.buttonLink || ""}
            onChange={(e) =>
              updateContent("buttonLink", e.target.value)
            }
            placeholder="/contact"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-4 border-b border-neutral-200 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Layout
        </span>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Alignment
          </label>

          <select
            value={config.alignment || "left"}
            onChange={(e) =>
              updateConfig("alignment", e.target.value)
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-600"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Appearance
        </span>



        {/* Text */}
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