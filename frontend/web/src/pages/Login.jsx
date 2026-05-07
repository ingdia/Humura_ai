import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
  }

  return (
    <div className="login-container fade-in">
      <div className="glass-card login-card">
        <div className="login-header">
          <div className="login-icon-box">
            <LogIn size={28} color="var(--primary-blue)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Continue your wellness journey with Humura AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} color="var(--text-muted)" className="input-icon" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} color="var(--text-muted)" className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn">
            Sign In
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Create account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
