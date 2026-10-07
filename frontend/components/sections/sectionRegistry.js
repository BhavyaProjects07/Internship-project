import Hero from "./Hero";
import Header from "./Header";
import LogoCloud from "./LogoCloud";
import About from "./About";
import Services from "./Services";
import Portfolio from "./Portfolio";
import Stats from "./Stats";
import Process from "./Process";
import Testimonials from "./Testimonials";
import CTA from "./CTA";
import Footer from "./Footer";

import HeaderProperties from "../builder/properties/HeaderProperties";
import HeroProperties from "../builder/properties/HeroProperties";
import AboutProperties from "../builder/properties/AboutProperties";
import ServicesProperties from "../builder/properties/ServicesProperties";
import GalleryProperties from "../builder/properties/GalleryProperties";
import TestimonialsProperties from "../builder/properties/TestimonialProperties";
import ContactProperties from "../builder/properties/ContactProperties";

import Gallery from "./Gallery";
import Contact from "./Contact";

const sectionRegistry = {
  // =========================================================
  // HEADER
  // =========================================================
  header: {
    component: Header,
    label: "Header",
    description: "Website navigation and branding.",
    properties: HeaderProperties,
    canAdd: false,

    defaultContent: {
      logo: "Your Brand",
      navigation: [
        { label: "Home", link: "/" },
        { label: "About", link: "/about" },
        { label: "Services", link: "/services" },
      ],
      buttonText: "Get Started",
      buttonLink: "/contact",
    },

    defaultConfig: {
      backgroundColor: "transparent",
      sticky: true,

      layout: {
        width: "full",
        columns: 1,
        alignment: "center",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 20,
          right: 24,
          bottom: 20,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // HERO
  // =========================================================
  hero: {
    component: Hero,
    label: "Hero",
    description: "A prominent introduction section.",
    properties: HeroProperties,
    canAdd: true,

    defaultContent: {
      eyebrow: "Digital Studio",
      heading: "Digital experiences built for ambitious brands.",
      description:
        "We design and build high-performance digital products that help ambitious companies turn ideas into meaningful growth.",
      primaryButtonText: "Start a Project",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Our Work",
      secondaryButtonLink: "/work",
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 1,
        alignment: "center",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 128,
          right: 24,
          bottom: 128,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // LOGO CLOUD
  // =========================================================
  logocloud: {
    component: LogoCloud,
    label: "Logo Cloud",
    description: "Display trusted companies or partner logos.",
    canAdd: true,

    defaultContent: {
      heading: "TRUSTED BY AMBITIOUS TEAMS AT",
      logos: [
        { name: "Acme Corp", imageUrl: "https://tailwindui.com/plus/img/logos/158x48/transistor-logo-gray-900.svg" },
        { name: "Global", imageUrl: "https://tailwindui.com/plus/img/logos/158x48/reform-logo-gray-900.svg" },
        { name: "Nebula", imageUrl: "https://tailwindui.com/plus/img/logos/158x48/tuple-logo-gray-900.svg" },
        { name: "Quantum", imageUrl: "https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-gray-900.svg" },
        { name: "Horizon", imageUrl: "https://tailwindui.com/plus/img/logos/158x48/statamic-logo-gray-900.svg" },
      ],
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 5,
        alignment: "center",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 64,
          right: 24,
          bottom: 64,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // ABOUT
  // =========================================================
  about: {
    component: About,
    label: "About",
    description: "Introduce your company, team, or brand.",
    properties: AboutProperties,
    canAdd: true,

    defaultContent: {
      eyebrow: "Who We Are",
      heading: "We turn complex ideas into simple digital experiences.",
      description:
        "We are an independent digital agency that brings together strategic design and technical excellence. Our mission is to create distinctive products that people love to use.",
      highlightText:
        "Good design is good business. We help you achieve both.",
      metadata: [],
      pillars: [],
    },

    defaultConfig: {
  backgroundColor: "#ffffff",
  textColor: "#0a0a0a",

  layout: {
    width: "wide",
    columns: 2,
    alignment: "left",
    verticalAlignment: "center",
  },

  spacing: {
    padding: {
      top: 112,
      right: 24,
      bottom: 112,
      left: 24,
    },
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
},
  },

  // =========================================================
  // SERVICES
  // =========================================================
  services: {
    component: Services,
    label: "Services",
    description: "Showcase the services or capabilities you provide.",
    properties: ServicesProperties,
    canAdd: true,

    defaultContent: {
      eyebrow: "Core Capabilities",
      heading: "Everything you need to build what comes next.",
      serviceLabel: "Service Domain",
      deliverablesLabel: "Key Deliverables",
      buttonText: "Explore Capability",
      services: [
        {
          id: "service-1",
          title: "Strategy & Positioning",
          description: "We help brands define their purpose and position in the market."
        },
        {
          id: "service-2",
          title: "Digital Product Design",
          description: "End-to-end design for web, mobile, and spatial platforms."
        },
        {
          id: "service-3",
          title: "Engineering & Architecture",
          description: "Robust scalable systems built for modern performance standards."
        }
      ],
    },

    defaultConfig: {
      backgroundColor: "#f9fafb",
      textColor: "#0a0a0a",

      layout: {
        width: "wide",
        columns: 3,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // PORTFOLIO
  // =========================================================
  portfolio: {
    component: Portfolio,
    label: "Portfolio",
    description: "Showcase selected projects or work.",
    canAdd: true,

    defaultContent: {
      eyebrow: "Featured Work",
      heading: "Selected projects that show what we can do.",
      projects: [],
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 3,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // GALLERY
  // =========================================================
  gallery: {
    component: Gallery,
    label: "Gallery",
    description: "Showcase images, projects, or visual content.",
    properties: GalleryProperties,
    canAdd: true,

    defaultContent: {
      eyebrow: "Gallery",
      heading: "A collection of our work.",
      description:
        "Showcase your projects, products, spaces, or other visual content.",
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=800",
          alt: "Office Space"
        },
        {
          id: "img-2",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
          alt: "Architecture"
        },
        {
          id: "img-3",
          url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
          alt: "Team Collaboration"
        }
      ],
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 3,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // STATS
  // =========================================================
  stats: {
    component: Stats,
    label: "Stats",
    description: "Display important business metrics.",
    canAdd: true,

    defaultContent: {
      stats: [],
    },

    defaultConfig: {
      backgroundColor: "#111827",
      textColor: "#ffffff",

      layout: {
        width: "wide",
        columns: 4,
        alignment: "center",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 80,
          right: 24,
          bottom: 80,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // TESTIMONIALS
  // =========================================================
  testimonials: {
    component: Testimonials,
    label: "Testimonials",
    description: "Display customer or client testimonials.",
    properties: TestimonialsProperties,
    canAdd: true,

    defaultContent: {
      heading: "What our partners say",
      testimonials: [
        {
          id: "test-1",
          name: "Sarah Jenkins",
          role: "CEO",
          company: "TechNova",
          quote: "This agency transformed our product completely.",
          avatarUrl: "https://i.pravatar.cc/150?u=sarah"
        },
        {
          id: "test-2",
          name: "Michael Ross",
          role: "Director of Marketing",
          company: "Quantum",
          quote: "The best design partner we have ever worked with.",
          avatarUrl: "https://i.pravatar.cc/150?u=michael"
        }
      ],
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 3,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // PROCESS
  // =========================================================
  process: {
    component: Process,
    label: "Process",
    description: "Explain your workflow or project process.",
    canAdd: true,

    defaultContent: {
      eyebrow: "Our Approach",
      heading: "How we work together",
      steps: [],
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 3,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // CTA
  // =========================================================
  cta: {
    component: CTA,
    label: "Call To Action",
    description: "Encourage visitors to take an important action.",
    canAdd: true,

    defaultContent: {
      heading: "Let's build something remarkable together.",
      description:
        "Ready to start your next project? Get in touch and let's discuss how we can help.",
      buttonText: "Start a conversation",
      buttonLink: "/contact",
    },

    defaultConfig: {
      backgroundColor: "#000000",
      textColor: "#ffffff",

      layout: {
        width: "wide",
        columns: 1,
        alignment: "center",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // CONTACT
  // =========================================================
  contact: {
    component: Contact,
    label: "Contact",
    description: "Display contact information and a call to action.",
    properties: ContactProperties,
    canAdd: true,

    defaultContent: {
      eyebrow: "Get In Touch",
      heading: "Let's work together.",
      description:
        "Have a project in mind? We'd love to hear from you.",
      email: "hello@example.com",
      phone: "+91 98765 43210",
      address: "Your business address",
      buttonText: "Send a Message",
      buttonLink: "/contact",
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 2,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 96,
          right: 24,
          bottom: 96,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },

  // =========================================================
  // FOOTER
  // =========================================================
  footer: {
    component: Footer,
    label: "Footer",
    description: "Website footer with navigation and social links.",
    canAdd: true,

    defaultContent: {
      logo: "Your Brand",
      description:
        "We create digital experiences for ambitious brands.",
      columns: [],
      social: [],
      copyright:
        "© 2026 Your Brand. All rights reserved.",
    },

    defaultConfig: {
      backgroundColor: "#ffffff",
      textColor: "#111827",

      layout: {
        width: "wide",
        columns: 3,
        alignment: "left",
        verticalAlignment: "center",
      },

      spacing: {
        padding: {
          top: 64,
          right: 24,
          bottom: 64,
          left: 24,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  },
};

export default sectionRegistry;