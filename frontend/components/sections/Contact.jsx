"use client";
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getTypographyStyle, getButtonStyle } from "@/lib/sectionLayout";

export default function Contact({ content = {}, config = {} }) {
  // Database JSON fields can be null.
  const safeContent = content || {};
  const safeConfig = config || {};

  const {
    eyebrow = "",
    heading = "Let's work together.",
    description = "",
    email = "",
    phone = "",
    address = "",
    buttonText = "Send a Message",
    buttonLink = "#",
    buttonTarget = "_self",
  } = safeContent;

  const contentMaxWidth = getContentMaxWidth(safeConfig);
  const { textClass } = getAlignmentClasses(safeConfig, { layout: { alignment: "left" } });

  return (
    <section
      className="w-full flex flex-col"
      style={getSectionStyle(safeConfig, {
        spacing: { padding: { top: 80, bottom: 80, left: 24, right: 24 } },
      })}
    >
      <div className={`mx-auto w-full ${textClass}`} style={{ maxWidth: contentMaxWidth }}>
        {/* Heading */}
        <div className="max-w-3xl">
          {eyebrow && (
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-60"
              style={getTypographyStyle(safeConfig, "eyebrow")}
            >
              {eyebrow}
            </p>
          )}

          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={getTypographyStyle(safeConfig, "heading")}
          >
            {heading}
          </h2>

          {description && (
            <p
              className="mt-5 text-base leading-7 opacity-70"
              style={getTypographyStyle(safeConfig, "description")}
            >
              {description}
            </p>
          )}
        </div>

        {/* Contact Details + CTA */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            {email && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  Email
                </p>

                <a
                  href={`mailto:${email}`}
                  className="mt-1 block text-base font-medium hover:underline"
                  style={getTypographyStyle(safeConfig, "email")}
                >
                  {email}
                </a>
              </div>
            )}

            {phone && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  Phone
                </p>

                <a
                  href={`tel:${phone}`}
                  className="mt-1 block text-base font-medium hover:underline"
                  style={getTypographyStyle(safeConfig, "phone")}
                >
                  {phone}
                </a>
              </div>
            )}

            {address && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  Address
                </p>

                <p 
                  className="mt-1 text-base font-medium"
                  style={getTypographyStyle(safeConfig, "address")}
                >
                  {address}
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-start lg:justify-end">
            {buttonText && (() => {
              const btnStyleProps = getButtonStyle(safeConfig, "button");
              return (
                <a
                  href={buttonLink}
                  target={buttonTarget}
                  rel={buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 ${btnStyleProps.className || ''}`}
                  style={{
                  ...getTypographyStyle(safeConfig, "button"),
                  ...btnStyleProps.style
                }}
                >
                  {buttonText}
                </a>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}