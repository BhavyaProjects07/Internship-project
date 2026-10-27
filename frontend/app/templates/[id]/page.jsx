import Link from "next/link";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/sections/SectionRenderer";
import PuckPublicRenderer from "@/components/website-builder/PuckPublicRenderer";

const rawApiUrl =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";
const API_URL = rawApiUrl.replace(/\/+$/, "");

async function getTemplate(id) {
  try {
    const response = await fetch(`${API_URL}/templates/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Failed to fetch template for preview:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const template = await getTemplate(id);

  if (!template) {
    return {
      title: "Template Not Found",
    };
  }

  return {
    title: `Preview: ${template.name}`,
    description: template.description || "Website template preview",
  };
}

export default async function TemplatePage({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};
  const requestedPageSlug = query.page;

  const template = await getTemplate(id);

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Template Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            The requested template could not be loaded. It may not be published yet or does not exist.
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const pages = Array.isArray(template.pages) ? template.pages : [];

  if (pages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h1>
          <p className="text-sm text-gray-600 mb-6">
            This template has no pages created yet.
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  // Determine active page
  let activePage = null;
  if (requestedPageSlug) {
    activePage = pages.find((p) => p.slug === requestedPageSlug);
  }
  if (!activePage) {
    activePage = pages.find((p) => p.slug === "home") || pages[0];
  }

  const globalLayout = template.globalLayout || {};
  const hasPuckDocument =
    activePage?.editorData &&
    typeof activePage.editorData === "object" &&
    Array.isArray(activePage.editorData.content) &&
    activePage.editorData.content.length > 0;

  const hasLegacySections =
    Array.isArray(activePage?.sections) && activePage.sections.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Top Template Preview Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-xs sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Templates</span>
          </Link>

          <span className="h-4 w-px bg-gray-200" aria-hidden="true" />

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Previewing</span>
            <h1 className="text-sm font-semibold text-gray-900 leading-tight">{template.name}</h1>
          </div>
        </div>

        {/* Multi-page Switcher */}
        {pages.length > 1 && (
          <nav className="hidden sm:flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            {pages.map((page) => {
              const isSelected = page.id === activePage.id;
              return (
                <Link
                  key={page.id}
                  href={`/templates/${template.id}?page=${page.slug || "home"}`}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "bg-white text-gray-900 shadow-xs font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {page.name}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Link
            href={`/templates`}
            className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 transition"
          >
            Use Template
          </Link>
        </div>
      </header>

      {/* Optional Global Layout Header */}
      {globalLayout?.header?.enabled && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            padding: "16px 24px",
            backgroundColor: globalLayout.header.backgroundColor || "#ffffff",
            color: globalLayout.header.textColor || "#111827",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {globalLayout.header.logoUrl ? (
            <img
              src={globalLayout.header.logoUrl}
              alt={globalLayout.header.logoText || "Logo"}
              style={{ maxWidth: 160, maxHeight: 48, objectFit: "contain" }}
            />
          ) : (
            <strong>{globalLayout.header.logoText || "Brand"}</strong>
          )}

          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {(globalLayout.header.links || []).map((link, index) => (
              <a
                key={`${link.href}-${index}`}
                href={link.href || "#"}
                style={{
                  color: globalLayout.header.textColor || "#111827",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>
      )}

      {/* Main Canvas / Content */}
      <main className="flex-1">
        {hasPuckDocument ? (
          <PuckPublicRenderer
            data={activePage.editorData}
            pages={template.pages}
            activePageId={activePage.id}
            templateId={template.id}
            templateName={template.name}
          />
        ) : hasLegacySections ? (
          <div className="space-y-0">
            {activePage.sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Page Content Empty</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              This page ({activePage.name}) does not have any design components saved yet.
            </p>
          </div>
        )}
      </main>

      {/* Optional Global Layout Footer */}
      {globalLayout?.footer?.enabled && (
        <footer
          style={{
            padding: "24px",
            backgroundColor: globalLayout.footer.backgroundColor || "#111827",
            color: globalLayout.footer.textColor || "#ffffff",
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p style={{ margin: 0, fontSize: 14 }}>
              {globalLayout.footer.copyrightText || "© All rights reserved."}
            </p>
            <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {(globalLayout.footer.links || []).map((link, index) => (
                <a
                  key={`${link.href}-${index}`}
                  href={link.href || "#"}
                  style={{
                    color: globalLayout.footer.textColor || "#ffffff",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      )}
    </div>
  );
}