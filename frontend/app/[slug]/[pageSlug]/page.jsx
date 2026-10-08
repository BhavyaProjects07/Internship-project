import { notFound } from "next/navigation";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { DEFAULT_THEME } from "@/lib/theme";

async function getPublishedWebsite(slug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}websites/public/${slug}`,
      { cache: 'no-store' }
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
  const { slug, pageSlug } = await params;
  const website = await getPublishedWebsite(slug);
  if (!website || !website.publishedData) {
    return { title: "Page Not Found" };
  }
  const page = website.publishedData.pages?.find(p => p.slug === pageSlug);
  if (!page) {
    return { title: "Page Not Found" };
  }
  return { title: `${page.name} | ${website.name}` };
}

export default async function PublicSubPage({ params }) {
  const { slug, pageSlug } = await params;
  const website = await getPublishedWebsite(slug);

  if (!website || !website.isPublished || !website.publishedData) {
    notFound();
  }

  const { publishedData } = website;
  const pages = publishedData.pages || [];

  const targetPage = pages.find((p) => p.slug === pageSlug);

  if (!targetPage) {
    notFound();
  }

  // Sort sections by order
  const sections = [...(targetPage.sections || [])].sort((a, b) => a.order - b.order);

  // Generate theme variables
  const colors = publishedData.theme?.colors || DEFAULT_THEME.colors;
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
    <div style={themeVars} className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
