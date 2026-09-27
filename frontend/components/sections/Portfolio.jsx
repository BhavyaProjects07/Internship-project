import React from 'react';

export default function Portfolio({ content, config }) {
  const { eyebrow, heading, projects } = content || {};
  const { backgroundColor = "#ffffff", textColor = "#111827" } = config || {};

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor, color: textColor }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            {eyebrow && (
              <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
                {eyebrow}
              </h2>
            )}
            {heading && (
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                {heading}
              </h3>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {projects?.map((project, index) => (
            <div 
              key={index} 
              className={`group flex flex-col ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] mb-6">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-200 text-lg font-medium">
                    {project.title} Image
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-bold mb-2">{project.title}</h4>
                  <p className="text-gray-500 text-sm font-medium">{project.category}</p>
                </div>
                {project.link && (
                  <a href={project.link} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-colors group-hover:bg-black group-hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
