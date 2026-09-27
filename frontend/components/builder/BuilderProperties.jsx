"use client";

import HeroProperties from "./properties/HeroProperties";

const propertyRegistry = {
  hero: HeroProperties,
};

export default function BuilderProperties({
  selectedSection,
  onChange,
}) {
  if (!selectedSection) {
    return (
      <aside className="hidden w-80 shrink-0 border-l bg-white p-5 lg:block">
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-gray-500">
            Select a section to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  const PropertiesComponent =
    propertyRegistry[selectedSection.type];

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l bg-white lg:block">
      {PropertiesComponent ? (
        <PropertiesComponent
          section={selectedSection}
          onChange={onChange}
        />
      ) : (
        <div className="p-6">
          <p className="text-sm text-gray-500">
            Editing for the "{selectedSection.type}" section
            is not available yet.
          </p>
        </div>
      )}
    </aside>
  );
}