export default function HeroProperties({ section, onChange }) {
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
    <div className="p-5">

      {/* Header */}
      <div className="border-b pb-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Section
        </p>

        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Hero
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Edit the content and appearance of your hero section.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-5 py-5">

        <div>
          <label
            htmlFor="hero-heading"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Heading
          </label>

          <textarea
            id="hero-heading"
            value={content.heading || ""}
            onChange={(event) =>
              updateContent("heading", event.target.value)
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="hero-description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="hero-description"
            value={content.description || ""}
            onChange={(event) =>
              updateContent("description", event.target.value)
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="hero-button-text"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Button Text
          </label>

          <input
            id="hero-button-text"
            type="text"
            value={content.buttonText || ""}
            onChange={(event) =>
              updateContent("buttonText", event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="hero-button-link"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Button Link
          </label>

          <input
            id="hero-button-link"
            type="text"
            value={content.buttonLink || ""}
            onChange={(event) =>
              updateContent("buttonLink", event.target.value)
            }
            placeholder="/contact"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

      </div>

      {/* Appearance */}
      <div className="border-t pt-5">

        <p className="mb-4 text-sm font-semibold text-gray-900">
          Appearance
        </p>

        {/* Alignment */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Alignment
          </label>

          <div className="grid grid-cols-3 gap-2">

            {["left", "center", "right"].map((alignment) => (
              <button
                key={alignment}
                type="button"
                onClick={() =>
                  updateConfig("alignment", alignment)
                }
                className={`rounded-lg border px-2 py-2 text-xs font-medium capitalize transition ${
                  config.alignment === alignment
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {alignment}
              </button>
            ))}

          </div>
        </div>

        {/* Background */}
        <div className="mt-5">
          <label
            htmlFor="hero-background"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Background Color
          </label>

          <div className="flex gap-2">

            <input
              id="hero-background"
              type="color"
              value={config.backgroundColor || "#111111"}
              onChange={(event) =>
                updateConfig(
                  "backgroundColor",
                  event.target.value
                )
              }
              className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 p-1"
            />

            <input
              type="text"
              value={config.backgroundColor || "#111111"}
              onChange={(event) =>
                updateConfig(
                  "backgroundColor",
                  event.target.value
                )
              }
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
            />

          </div>
        </div>

        {/* Text Color */}
        <div className="mt-5">
          <label
            htmlFor="hero-text-color"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Text Color
          </label>

          <div className="flex gap-2">

            <input
              id="hero-text-color"
              type="color"
              value={config.textColor || "#ffffff"}
              onChange={(event) =>
                updateConfig(
                  "textColor",
                  event.target.value
                )
              }
              className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 p-1"
            />

            <input
              type="text"
              value={config.textColor || "#ffffff"}
              onChange={(event) =>
                updateConfig(
                  "textColor",
                  event.target.value
                )
              }
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
            />

          </div>
        </div>

      </div>

    </div>
  );
}