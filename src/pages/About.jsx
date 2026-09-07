export default function About() {
    const skillCategories = [
        { title: "Frontend", skills: ["JavaScript", "HTML", "CSS"] },
        { title: "Backend", skills: ["Java", "Python"] },
        { title: "Frameworks", skills: ["React.js", "Node.js"] },
        { title: "Version Control", skills: ["Git", "GitHub"] },
        { title: "Database", skills: ["SQL"] },
    ];

    return (
        <div className="about-me-container">
            <h1 className="header-landing">About Me</h1>

            <p className="about-intro">
                My journey into web development started with AWS. Ever since I joined
                the student builder group, I started growing and learning with
                frontend development of the website. It is now published and running.
                I am so proud of what my team and I have contributed. I am now the
                Vice Chief of Technology.
            </p>

            <div className="skills-grid">
                {skillCategories.map((category) => (
                    <section key={category.title} className="skill-category">
                        <h2 className="headers-about">{category.title}</h2>
                        <ul className="skills-list">
                            {category.skills.map((skill) => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <h2 className="header-landing">What I'm Working On Currently</h2>
            <p className="header-description">[Portfolio / Event Registration System]</p>
        </div>
    )
}