import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="nav-bar-container">
            <nav className="Nav-bars">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/projects">Projects</NavLink>
        </nav>
        </div>
        
)
}

