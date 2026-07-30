import { useState } from "react"

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
        <div form-container>
            <h1 className="header-landing">Contact me, let's get along.</h1>
            <form onSubmit={handleSubmit}>
            <div className="input-boxes">   
                <input className="userName-box" 
            name="userName" 
            value={form.name} 
            onChange={handleChange}   
            placeholder="name"  
            required />

            <input className="userEmail-box"
            name="userEmail" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="your@gmail.com"
            required />

            <textarea className="userMessage-box"
            name="userMessage" 
            value={form.message} 
            onChange={handleChange} 
            placeholder="Send a message.."
            required />

            <button className="submit-btn" type="submit">Send</button>
            </div>
        </form>
         <h2 className="header-landing">- Check out my other socials -</h2>
         <div className="socials-container">
             <div className="socials">
                <a href="https://www.facebook.com/share/19DfdSR2J1/" target="_blank" rel="noopener noreferrer" className="social-name">
                    Facebook
                </a>
                <a href="https://www.instagram.com/_jvmszn?igsh=M25oZXR0OWQ2Z2F5" target="_blank" rel="noopener noreferrer" className="social-name">
                    Instagram
                </a>
                <a href="https://www.linkedin.com/in/james-sederia-4b87383a8?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-name">
                    LinkedIn
                </a>
                <a href="https://github.com/james-sed" target="_blank" rel="noopener noreferrer" className="social-name">
                    Github
                </a>
        </div>
</div>
        </div> 
)
}
