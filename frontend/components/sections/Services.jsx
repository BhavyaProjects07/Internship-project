import React from 'react';

export default function Services({ content, config }) {
  const { heading, services } = content || {};
  const { backgroundColor = "#f9fafb", textColor = "#111827" } = config || {};

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        {heading && (
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 md:mb-24 text-center md:text-left">
            {heading}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {services?.map((service, index) => (
            <div 
              key={index} 
              className="group flex flex-col p-8 rounded-3xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 text-sm font-semibold tracking-wider text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                {service.description}
              </p>
              {(service.link || service.url) && (
                <a href={service.link || service.url || "#"} className="mt-8 inline-flex items-center text-sm font-semibold group-hover:text-blue-600 transition-colors">
                  Learn more <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
