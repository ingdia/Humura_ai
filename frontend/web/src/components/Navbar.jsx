import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, User, Menu } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Heart size={32} color="var(--primary-blue)" fill="var(--primary-blue)" style={{ opacity: 0.8 }} />
          <span>Humura <span style={{ color: 'var(--sage-green)' }}>AI</span></span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/community" className="nav-link">Community</Link>
          <Link to="/login" className="btn btn-primary">
            <User size={18} />
            Sign In
          </Link>
        </div>
        
        <button className="mobile-btn">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
