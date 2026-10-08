import { notFound } from "next/navigation";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { DEFAULT_THEME } from "@/lib/theme";

async function getPublishedWebsite(slug) {
  try {
    const response = await fetch(
      `${process.env.API_URL}websites/public/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error("Failed to fetch public website:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const website = await getPublishedWebsite(slug);

  if (!website || !website.publishedData) {
    return {
      title: "Website Not Found",
    };
  }

  return {
    title: website.name || website.publishedData.name || "Website",
  };
}

export default async function PublicWebsitePage({ params }) {
  const { slug } = await params;

  const website = await getPublishedWebsite(slug);

  // The backend public API already verifies:
  // - website exists
  // - website is published
  // - publishedData exists
  //
  // Therefore the frontend only needs to verify that
  // publishedData was successfully returned.
  if (!website || !website.publishedData) {
    notFound();
  }

  const { publishedData } = website;

  const pages = Array.isArray(publishedData.pages)
    ? publishedData.pages
    : [];

  if (pages.length === 0) {
    notFound();
  }

  // Find the Home page by its published page slug.
  let homePage = pages.find((page) => page.slug === "home");

  // If there is no page explicitly named "home",
  // fall back to the page with the lowest order.
  if (!homePage) {
    homePage = [...pages].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    )[0];
  }

  if (!homePage) {
    notFound();
  }

  // Render sections according to their stored order.
  const sections = Array.isArray(homePage.sections)
    ? [...homePage.sections].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      )
    : [];

  // Use the published theme configuration.
  // Fall back to the application's default theme when
  // a published color is missing.
  const colors = {
    ...DEFAULT_THEME.colors,
    ...(publishedData.theme?.colors || {}),
  };

  const themeVars = {
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-background": colors.background,
    "--color-surface": colors.surface,
    "--color-text": colors.text,
    "--color-muted-text": colors.mutedText,
    "--color-border": colors.border,
    "--color-success": colors.success,
    "--color-warning": colors.warning,
    "--color-error": colors.error,
  };

  return (
    <div
      style={themeVars}
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]"
    >
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
        />
      ))}
    </div>
  );
}