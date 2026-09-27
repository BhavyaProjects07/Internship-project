import React from 'react';

export default function Testimonials({ content, config }) {
  const { heading, testimonials } = content || {};
  const { backgroundColor = "#f9fafb", textColor = "#111827" } = config || {};

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        {heading && (
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">
            {heading}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials?.map((testimonial, index) => (
            <div key={index} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                {/* Rating stars if available, else simple quote icon */}
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-gray-700 leading-relaxed mb-8 italic">
                  "{testimonial.quote || testimonial.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {testimonial.avatarUrl ? (
                  <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {testimonial.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
