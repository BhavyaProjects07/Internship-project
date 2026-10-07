import React from 'react';
import { getSectionStyle, getContentMaxWidth, getAlignmentClasses, getGridColumnsClass, getTypographyStyle } from "@/lib/sectionLayout";
export default function Testimonials({ content, config }) {
  const { heading, testimonials } = content || {};
  const contentMaxWidth = getContentMaxWidth(config);
  const { textClass, itemsClass } = getAlignmentClasses(config, { layout: { alignment: "left" } });
  const gridColumns = getGridColumnsClass(config, { layout: { columns: 3 } });
  const defaultTestimonials = [
    {
      name: "Sarah Jenkins",
      role: "VP of Product",
      company: "TechFlow",
      quote: "The team delivered an exceptional product that exceeded our expectations. Their technical rigor, architectural clarity, and design taste is unmatched in the industry.",
      outcome: "+140% Qualified Inbound in 6 Months",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "Founder & CEO",
      company: "Elevate Systems",
      quote: "Partnering with Modern Agency was the highest-leverage decision we made this year. They transformed our fragmented MVP into a category-defining market leader.",
      outcome: "$2.4M Pipeline Generated Post-Launch",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Brand",
      company: "Lumina Labs",
      quote: "They brought our complex vision to life faster and with significantly higher polish than we thought possible. Unwavering communication and engineering excellence.",
      outcome: "Shipped 3 Weeks Ahead of Schedule",
      rating: 5
    }
  ];

  const testimonialList = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section 
      className="w-full flex flex-col" 
      style={getSectionStyle(config, {
        spacing: { padding: { top: 112, bottom: 112, left: 24, right: 24 } },
        backgroundColor: "#f9fafb"
      })}
    >
      <div className={`mx-auto w-full ${textClass} ${itemsClass}`} style={{ maxWidth: contentMaxWidth }}>
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-3">
            Client Proof
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]"
            style={getTypographyStyle(config, "heading")}
          >
            {heading || "What our partners say about working with us"}
          </h2>
        </div>

        <div className={`grid gap-8 w-full ${gridColumns}`}>
          {testimonialList.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-neutral-950/5 hover:border-neutral-300 transition-all duration-300"
            >
              <div>
                {/* 5-star rating or verified stamp */}
                <div className="flex items-center gap-1 mb-6 text-amber-500">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs font-mono text-neutral-400">Verified Client</span>
                </div>

                <blockquote
                  className="text-base sm:text-lg text-neutral-800 leading-relaxed mb-6 font-normal"
                  style={getTypographyStyle(config, "testimonials", index, "quote")}
                >
                  &quot;{item.quote || item.text}&quot;
                </blockquote>

                {item.outcome && (
                  <div className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-2.5 py-1 mb-8">
                    {item.outcome}
                  </div>
                )}
              </div>

              {/* Attribution */}
              <div className="pt-6 border-t border-neutral-100 flex items-center gap-3.5">
                {item.avatarUrl ? (
                  <img 
                    src={item.avatarUrl} 
                    alt={item.name} 
                    className="rounded-full border border-neutral-200"
                    style={{
                      objectFit: item.objectFit || "cover",
                      objectPosition: item.objectPosition || "center",
                      width: item.width || "2.75rem",
                      height: item.height || "2.75rem"
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs tracking-tight">
                    {item.name ? item.name.split(' ').map(n => n[0]).join('').slice(0, 2) : "CL"}
                  </div>
                )}
                <div>
                  <div 
                    className="text-sm font-bold text-neutral-950"
                    style={getTypographyStyle(config, "testimonials", index, "name")}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    <span style={getTypographyStyle(config, "testimonials", index, "role")}>{item.role}</span>
                    {item.company && (
                      <>
                        <span aria-hidden="true">{" · "}</span>
                        <span style={getTypographyStyle(config, "testimonials", index, "company")}>{item.company}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
