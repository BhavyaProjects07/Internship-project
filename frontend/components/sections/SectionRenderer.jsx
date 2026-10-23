import sectionRegistry from "./sectionRegistry";

export default function SectionRenderer({ section, websiteSlug }) {
  if (!section) {
    return null;
  }

  const definition = sectionRegistry[section.type];

  if (!definition) {
    return null;
  }

  const Component = definition.component;

  if (!Component) {
    return null;
  }

  return (
    <Component
      content={section.content}
      config={section.config}
      websiteSlug={websiteSlug}
    />
  );
}