"use client";

import React from "react";

export default function ServicesProperties({ section, onChange }) {
  const content = section.content || {};
  const config = section.config || {};

  const services = Array.isArray(content.services)
    ? content.services
    : [];

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

  // --------------------------------------------------
  // SERVICE ITEMS
  // --------------------------------------------------

  const updateService = (index, field, value) => {
    const updatedServices = services.map((service, serviceIndex) => {
      if (serviceIndex !== index) {
        return service;
      }

      return {
        ...service,
        [field]: value,
      };
    });

    updateContent("services", updatedServices);
  };

  const addService = () => {
    updateContent("services", [
      ...services,
      {
        title: "New Service",
        description: "Describe this service.",
        deliverables: [
          "Key Deliverable",
        ],
        link: "#contact",
      },
    ]);
  };

  const removeService = (index) => {
    updateContent(
      "services",
      services.filter((_, serviceIndex) => serviceIndex !== index)
    );
  };

  // --------------------------------------------------
  // DELIVERABLES
  // --------------------------------------------------

  const updateDeliverable = (
    serviceIndex,
    deliverableIndex,
    value
  ) => {
    const updatedServices = services.map(
      (service, currentServiceIndex) => {
        if (currentServiceIndex !== serviceIndex) {
          return service;
        }

        const deliverables = Array.isArray(service.deliverables)
          ? service.deliverables
          : [];

        const updatedDeliverables = deliverables.map(
          (item, currentDeliverableIndex) => {
            if (currentDeliverableIndex !== deliverableIndex) {
              return item;
            }

            return value;
          }
        );

        return {
          ...service,
          deliverables: updatedDeliverables,
        };
      }
    );

    updateContent("services", updatedServices);
  };

  const addDeliverable = (serviceIndex) => {
    const updatedServices = services.map(
      (service, currentServiceIndex) => {
        if (currentServiceIndex !== serviceIndex) {
          return service;
        }

        const deliverables = Array.isArray(service.deliverables)
          ? service.deliverables
          : [];

        return {
          ...service,
          deliverables: [
            ...deliverables,
            "New Deliverable",
          ],
        };
      }
    );

    updateContent("services", updatedServices);
  };

  const removeDeliverable = (
    serviceIndex,
    deliverableIndex
  ) => {
    const updatedServices = services.map(
      (service, currentServiceIndex) => {
        if (currentServiceIndex !== serviceIndex) {
          return service;
        }

        const deliverables = Array.isArray(service.deliverables)
          ? service.deliverables
          : [];

        return {
          ...service,
          deliverables: deliverables.filter(
            (_, currentDeliverableIndex) =>
              currentDeliverableIndex !== deliverableIndex
          ),
        };
      }
    );

    updateContent("services", updatedServices);
  };

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white lg:flex lg:flex-col">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="border-b border-neutral-200 bg-neutral-50/50 p-5">
        <div className="mb-1 flex items-center justify-between">
          <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-600">
            Block: Services
          </span>

          <span className="text-xs font-mono text-neutral-400">
            #{section.id.slice(-6)}
          </span>
        </div>

        <h3 className="text-base font-bold text-neutral-900">
          Services Section Settings
        </h3>

        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Customize your capabilities, deliverables and section presentation.
        </p>
      </div>

      {/* ================================================== */}
      {/* SECTION CONTENT */}
      {/* ================================================== */}

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
            placeholder="Core Capabilities"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Heading */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Heading
          </label>

          <textarea
            rows={3}
            value={content.heading || ""}
            onChange={(e) =>
              updateContent("heading", e.target.value)
            }
            placeholder="Everything you need to build what comes next."
            className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs leading-relaxed text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Service Label */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Service Label
          </label>

          <input
            type="text"
            value={content.serviceLabel || ""}
            onChange={(e) =>
              updateContent("serviceLabel", e.target.value)
            }
            placeholder="Service Domain"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Deliverables Label */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Deliverables Label
          </label>

          <input
            type="text"
            value={content.deliverablesLabel || ""}
            onChange={(e) =>
              updateContent(
                "deliverablesLabel",
                e.target.value
              )
            }
            placeholder="Key Deliverables"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

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
            placeholder="Explore Capability"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* SERVICES */}
      {/* ================================================== */}

      <div className="space-y-4 border-b border-neutral-200 p-5">

        <div className="flex items-center justify-between">
          <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Services
          </span>

          <button
            type="button"
            onClick={addService}
            className="rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            + Add
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-neutral-500">
          Add, remove and edit individual service offerings.
        </p>

        {services.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center">
            <p className="text-xs text-neutral-400">
              No services yet.
            </p>

            <button
              type="button"
              onClick={addService}
              className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Add service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service, index) => {
              const deliverables = Array.isArray(
                service.deliverables
              )
                ? service.deliverables
                : [];

              return (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-3"
                >

                  {/* SERVICE HEADER */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                      Service{" "}
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-[10px] font-semibold text-red-500 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  {/* TITLE */}
                  <div className="mb-3">
                    <label className="mb-1.5 block text-[11px] font-semibold text-neutral-700">
                      Title
                    </label>

                    <input
                      type="text"
                      value={service.title || ""}
                      onChange={(e) =>
                        updateService(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Strategy & Architecture"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-3">
                    <label className="mb-1.5 block text-[11px] font-semibold text-neutral-700">
                      Description
                    </label>

                    <textarea
                      rows={4}
                      value={service.description || ""}
                      onChange={(e) =>
                        updateService(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe this service..."
                      className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs leading-relaxed text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {/* LINK */}
                  <div className="mb-4">
                    <label className="mb-1.5 block text-[11px] font-semibold text-neutral-700">
                      Link
                    </label>

                    <input
                      type="text"
                      value={service.link || ""}
                      onChange={(e) =>
                        updateService(
                          index,
                          "link",
                          e.target.value
                        )
                      }
                      placeholder="/services/strategy"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  {/* DELIVERABLES */}
                  <div className="border-t border-neutral-200 pt-4">

                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-neutral-700">
                        Deliverables
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          addDeliverable(index)
                        }
                        className="text-[10px] font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        + Add
                      </button>
                    </div>

                    {deliverables.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-3 text-center">
                        <p className="text-[10px] text-neutral-400">
                          No deliverables.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            addDeliverable(index)
                          }
                          className="mt-1 text-[10px] font-semibold text-blue-600"
                        >
                          Add deliverable
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {deliverables.map(
                          (deliverable, deliverableIndex) => (
                            <div
                              key={deliverableIndex}
                              className="flex items-center gap-2"
                            >
                              <span className="w-5 shrink-0 text-center text-[10px] font-mono text-neutral-400">
                                {deliverableIndex + 1}
                              </span>

                              <input
                                type="text"
                                value={deliverable || ""}
                                onChange={(e) =>
                                  updateDeliverable(
                                    index,
                                    deliverableIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="New Deliverable"
                                className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeDeliverable(
                                    index,
                                    deliverableIndex
                                  )
                                }
                                className="shrink-0 text-[10px] font-semibold text-red-500 hover:text-red-600"
                                aria-label="Remove deliverable"
                              >
                                ×
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* APPEARANCE */}
      {/* ================================================== */}

      <div className="space-y-4 p-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Appearance
        </span>



        {/* Text Color */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Text Color
          </label>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.textColor || "#0a0a0a"}
              onChange={(e) =>
                updateConfig(
                  "textColor",
                  e.target.value
                )
              }
              className="h-8 w-10 cursor-pointer rounded-lg border border-neutral-300 bg-white p-0.5"
            />

            <input
              type="text"
              value={config.textColor || "#0a0a0a"}
              onChange={(e) =>
                updateConfig(
                  "textColor",
                  e.target.value
                )
              }
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-mono uppercase text-neutral-800 outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}