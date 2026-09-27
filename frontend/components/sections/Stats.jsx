import React from 'react';

export default function Stats({ content, config }) {
  const { stats } = content || {};
  const { backgroundColor = "#111827", textColor = "#ffffff" } = config || {};

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x divide-white/10">
          {stats?.map((stat, index) => (
            <div key={index} className={`flex flex-col ${index !== 0 ? 'pl-8 md:pl-12' : ''}`}>
              <div className="text-5xl md:text-7xl font-light tracking-tighter mb-4">
                {stat.value}
              </div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
