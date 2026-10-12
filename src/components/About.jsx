import {
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineLightningBolt,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import Reveal from "./Reveal";

const FACTS = [
  {
    id: "role",
    Icon: HiOutlineBriefcase,
    text: (
      <>
        <strong>Front-end Developer</strong> at AWS SBG JRU
      </>
    ),
  },
  {
    id: "leadership",
    Icon: HiOutlineAcademicCap,
    text: (
      <>
        <strong>Vice Chief of Technology</strong> of the student community
      </>
    ),
  },
  {
    id: "working-on",
    Icon: HiOutlineLightningBolt,
    text: (
      <>
        Currently building an <strong>Event Registration System</strong>
      </>
    ),
  },
  {
    id: "location",
    Icon: HiOutlineLocationMarker,
    text: (
      <>
        Based in <strong>the Philippines</strong> · open to remote roles
      </>
    ),
  },
];

export default function About() {
  return (
    <section
      className="section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="container about-grid">
        <Reveal className="about-portrait">
          <img
            src="/about.svg"
            alt="Illustration of a developer working on a clean interface"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
          />
          <span className="about-portrait__frame" aria-hidden="true" />
        </Reveal>

        <Reveal className="about-body" delay={120}>
          <p className="eyebrow">About me</p>
          <h2 className="section__title" id="about-title" style={{ marginTop: "0.9rem" }}>
            Code that's clean, accessible, and made to be used.
          </h2>
          <p>
            My journey into web development started with AWS. After joining the
            Student Builders group, I grew into front-end development and helped
            ship our group's website — now published and running. I still
            remember how proud the team was on launch day.
          </p>
          <p>
            Today I focus on building interfaces that are fast, readable, and
            enjoyable to use — clean HTML, thoughtful CSS, and React that
            scales. If it needs to load fast and feel good under your fingers,
            I'm in.
          </p>

          <ul className="about-facts">
            {FACTS.map(({ id, Icon, text }) => (
              <li className="about-fact" key={id}>
                <Icon size={20} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}