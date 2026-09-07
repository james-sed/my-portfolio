import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-wordmark" onClick={closeMenu}>
          Sederia
        </Link>

        <button
          className={`navbar-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/projects" onClick={closeMenu}>
            Projects
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
