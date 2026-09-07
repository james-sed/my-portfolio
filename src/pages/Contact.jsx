import { useState } from "react"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa"

export default function Contact() {
    const [form, setForm] = useState({ userName: '', userEmail: '', userMessage: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    if (submitted) {
        return <p className="form-sub-confirm">Thanks, {form.userName}!</p>
    }

    return (
        <div className="contact-wrapper">
            <h1 className="contact-heading">Get in touch.</h1>

            <form onSubmit={handleSubmit} className="contact-card">
                <input
                    className="contact-input"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />

                <input
                    className="contact-input"
                    name="userEmail"
                    type="email"
                    value={form.userEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                />

                <textarea
                    className="contact-textarea"
                    name="userMessage"
                    value={form.userMessage}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={5}
                    required
                />

                <button className="contact-btn" type="submit">Send</button>
            </form>

            <p className="socials-label">Find me elsewhere</p>
            <div className="socials-row">
                <a href="https://www.facebook.com/share/19DfdSR2J1/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
                    <FaFacebookF size={20} />
                </a>
                <a href="https://www.instagram.com/_jvmszn?igsh=M25oZXR0OWQ2Z2F5" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                    <FaInstagram size={20} />
                </a>
                <a href="https://www.linkedin.com/in/james-sederia-4b87383a8?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                    <FaLinkedinIn size={20} />
                </a>
                <a href="https://github.com/james-sed" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                    <FaGithub size={20} />
                </a>
            </div>
        </div>
    )
}
