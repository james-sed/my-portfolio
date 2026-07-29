export default function Home() {
    return (

    <div className="header-container">
        <h1 className="header-landing">Welcome to My Portfolio</h1>
        <p className="header-description"> Hi, I'm [James Sederia] — a Front-end Developer of AWS SBG JRU who is passionate about building 
        clean, functional, and user-friendly websites. I specialize in 
        <strong className="strong-words"> HTML, CSS, JavaScript, React, and Front-end tools.</strong></p>
        <p className="header-description"> Take a look around to see some of my projects, learn more about 
        my background, or get in touch if you'd like to work together.</p>
    </div>
    )
    }

export function contactBtn() {
    return (
        <div className="btn-container">
            <Link to="/contact" className="contact-button">Contact</Link>
        </div>
    )
}