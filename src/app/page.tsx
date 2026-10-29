import Activity from "@/components/Activity";
import CertificationList from "@/components/CertificationList";
import EducationList from "@/components/EducationList";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import ProjectTabs from "@/components/ProjectTabs";
import ScrollRead from "@/components/ScrollRead";
import Section from "@/components/Section";
import SkillsBento from "@/components/SkillsBento";
import { about, aboutHighlights, profile } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Loader />

      <Hero />

      {/* All sections share one wide column so their large type and grids have room */}
      <main className="mx-auto w-full max-w-[68rem] px-4 sm:px-6">
        <ScrollRead id="about" label="About Me" paragraphs={about} highlights={aboutHighlights} photo={profile.photo} />

        <Section id="education" label="Education">
          <EducationList />
        </Section>

        <Section id="experience" label="Career & Experience">
          <Experience />
        </Section>

        <Section id="skills" label="Skills & Toolbox">
          <SkillsBento />
        </Section>

        {/* Projects and Activity sit closer together: half the usual gap between sections */}
        <Section id="projects" label="Featured Projects" padding="pt-12 pb-6 sm:pt-16 sm:pb-8">
          <ProjectTabs />
        </Section>

        <Section id="activity" label="Activity" padding="pt-6 pb-12 sm:pt-8 sm:pb-16">
          <Activity />

          <h3 className="mb-3 mt-16 sm:mt-20 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Certifications
          </h3>
          <CertificationList />
        </Section>
      </main>

      <Footer />
    </>
  );
}
