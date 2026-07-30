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
        return <p>Thanks, {form.userName}!</p>
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
         <h2 className="header-landing">My other socials</h2>
         <div className="icon-container">
            <p>Facebook</p>
            <p>Instagram</p>
            <p>LinkedIn</p>
            <p>Github</p>
         </div>
        </div> 
)
}
