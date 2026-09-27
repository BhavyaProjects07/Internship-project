import SectionRenderer from "@/components/SectionRenderer";

export default function Home() {
  const section = {
    type: "hero",

    content: {
      heading: "Build Something Amazing",
      description:
        "This is a dynamically rendered hero section.",
      buttonText: "Get Started",
      buttonLink: "#",
    },

    config: {
      alignment: "center",
      backgroundColor: "#111827",
      textColor: "#ffffff",
    },
  };

  return (
    <main>
      <SectionRenderer section={section} />
    </main>
  );
}