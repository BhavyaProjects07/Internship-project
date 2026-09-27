import React from 'react';

export default function Footer({ content, config }) {
  const { logo, description, columns, social, copyright } = content || {};
  const { backgroundColor = "#ffffff", textColor = "#111827" } = config || {};

  return (
    <footer className="py-20 px-6 md:px-12 border-t border-gray-100" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold tracking-tight mb-6">
              {logo || "Modern Agency"}
            </div>
            {description && (
              <p className="text-gray-500 max-w-sm leading-relaxed text-balance">
                {description}
              </p>
            )}
          </div>

          {/* Link Columns */}
          {columns?.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-bold mb-6">{col.title}</h4>
              <ul className="flex flex-col gap-4">
                {col.links?.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href={link.url || link.link || "#"} className="text-gray-500 hover:text-black transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            {copyright || `© ${new Date().getFullYear()} Modern Agency. All rights reserved.`}
          </div>
          
          <div className="flex gap-6">
            {social?.map((link, idx) => (
              <a key={idx} href={link.url || link.link || "#"} className="text-gray-400 hover:text-black transition-colors text-sm font-medium">
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
