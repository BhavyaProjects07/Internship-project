"use client";
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";

export default function Gallery({ content = {}, config = {} }) {
  const {
    eyebrow = "",
    heading = "Our Gallery",
    description = "",
    images = [],
  } = content;

  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass } = getAlignmentClasses(config, { layout: { alignment: "left" } });
  const gridColumns = getGridColumnsClass(config, { layout: { columns: 3 } });


  return (
    <section
      className="w-full flex flex-col"
      style={getSectionStyle(config, {
        spacing: { padding: { top: 80, bottom: 80, left: 24, right: 24 } }
      })}
    >
      <div className={`mx-auto w-full ${textClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className="mb-12 max-w-3xl">
          {eyebrow && (
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-60"
              style={getTypographyStyle(config, "eyebrow")}
            >
              {eyebrow}
            </p>
          )}

          <h2
            className="text-3xl font-bold tracking-tight @sm:text-4xl"
            style={getTypographyStyle(config, "heading")}
          >
            {heading}
          </h2>

          {description && (
            <p
              className="mt-4 text-base leading-7 opacity-70"
              style={getTypographyStyle(config, "description")}
            >
              {description}
            </p>
          )}
        </div>

        {images.length > 0 ? (
          <div
            className={`grid gap-5 ${gridColumns}`}
          >
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="group overflow-hidden rounded-2xl bg-neutral-100"
              >
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt || ""}
                    className="aspect-[4/3] transition duration-500 group-hover:scale-105"
                    style={{
                      objectFit: image.objectFit || "cover",
                      objectPosition: image.objectPosition || "center",
                      width: image.width || "100%",
                      height: image.height || "100%"
                    }}
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-sm text-neutral-400">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-400">
            Add gallery images from the editor.
          </div>
        )}
      </div>
    </section>
  );
}