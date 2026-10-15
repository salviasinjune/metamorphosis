import { useEffect, useState } from "react";
import Background from "./components/Background.jsx";
import { site } from "./content/site.js";
import { projects } from "./content/projects.js";
import { coursework } from "./content/coursework.js";
import { resume } from "./content/resume.js";

const MODE_KEY = "portfolio-color-order";

function readMode() {
  try {
    const saved = window.localStorage.getItem(MODE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Storage can be blocked; fall back to the default.
  }
  return "dark";
}

function OpensInNewTab() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}

export default function App() {
  // "dark": starts black, ends white.  "light": starts white, ends black.
  const [mode, setMode] = useState(readMode);

  useEffect(() => {
    document.title = `${site.name}, portfolio`;
  }, []);

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try {
      window.localStorage.setItem(MODE_KEY, next);
    } catch {
      // Ignore: the choice just won't be remembered.
    }
  };

  const email = `${site.contact.emailUser}@${site.contact.emailDomain}`;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Background mode={mode} />

      <header className="site-header">
        <a className="brand" href="#top">
          {site.name}
        </a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#coursework">Coursework</a>
          <a href="#resume">Résumé</a>
          <a href="#contact">Contact</a>
        </nav>
        <button type="button" className="mode-button" onClick={toggleMode} aria-pressed={mode === "light"}>
          Reverse colors
        </button>
      </header>

      <main id="main">
        <section className="panel panel-hero" id="top" aria-labelledby="hero-title">
          <div className="panel-inner">
            <h1 id="hero-title">{site.name}</h1>
            <p className="tagline">{site.tagline}</p>
            <p className="hint">{site.scrollHint}</p>
          </div>
        </section>

        <section className="panel" id="about" aria-labelledby="about-title">
          <div className="panel-inner">
            <h2 id="about-title">About me</h2>
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="panel" id="projects" data-stage-start="2" aria-labelledby="projects-title">
          <div className="panel-inner">
            <h2 id="projects-title">Projects</h2>
            <ul className="entries">
              {projects.map((project) => (
                <li className="entry" key={project.title}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.url && (
                    <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">
                      {project.linkLabel || "Visit site"}
                      <OpensInNewTab />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel" id="coursework" aria-labelledby="coursework-title">
          <div className="panel-inner">
            <h2 id="coursework-title">Coursework</h2>
            <ul className="entries">
              {coursework.map((course) => (
                <li className="entry" key={course.name}>
                  <h3>{course.name}</h3>
                  <p>{course.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel" id="resume" data-stage-start="3" aria-labelledby="resume-title">
          <div className="panel-inner">
            <h2 id="resume-title">Résumé</h2>

            <h3 className="group-title">Education</h3>
            <ul className="entries">
              {resume.education.map((item) => (
                <li className="entry" key={item.title}>
                  <h4>{item.title}</h4>
                  <p className="meta">{item.when}</p>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>

            <h3 className="group-title">Skills</h3>
            <ul className="entries">
              {resume.skills.map((group) => (
                <li className="entry" key={group.label}>
                  <h4>{group.label}</h4>
                  <p>{group.items.join(", ")}</p>
                </li>
              ))}
            </ul>

            <h3 className="group-title">Experience</h3>
            <ul className="entries">
              {resume.experience.map((item) => (
                <li className="entry" key={item.title}>
                  <h4>{item.title}</h4>
                  <p className="meta">
                    {item.where}, {item.when}
                  </p>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel panel-last" id="contact" aria-labelledby="contact-title">
          <div className="panel-inner">
            <h2 id="contact-title">Contact</h2>
            <p>{site.contact.intro}</p>
            <p>
              <a className="button-link" href={`mailto:${email}`}>
                Email me
              </a>
            </p>
            <ul className="link-row">
              {site.contact.links.map((link) => (
                <li key={link.url}>
                  <a className="text-link" href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <OpensInNewTab />
                  </a>
                </li>
              ))}
            </ul>
            <p className="footnote">Built with React and Vite.</p>
          </div>
        </section>
      </main>
    </>
  );
}
