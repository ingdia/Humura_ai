import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, UserCheck } from 'lucide-react'
import './Login.css' // Reusing login styles

const Register = () => {
  const [role, setRole] = useState('PATIENT')

  return (
    <div className="login-container fade-in">
      <div className="glass-card login-card" style={{ maxWidth: '550px' }}>
        <div className="login-header">
          <div className="login-icon-box">
            <UserPlus size={28} color="var(--primary-blue)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join Humura AI and start your wellness journey.</p>
        </div>

        <div style={styles.roleSelector}>
          <button 
            style={{ ...styles.roleBtn, ...(role === 'PATIENT' ? styles.activeRole : {}) }}
            onClick={() => setRole('PATIENT')}
          >
            <User size={20} />
            I'm a Patient
          </button>
          <button 
            style={{ ...styles.roleBtn, ...(role === 'PSYCHOLOGIST' ? styles.activeRole : {}) }}
            onClick={() => setRole('PSYCHOLOGIST')}
          >
            <UserCheck size={20} />
            I'm a Therapist
          </button>
        </div>

        <form className="login-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-wrapper">
              <User size={18} color="var(--text-muted)" className="input-icon" />
              <input type="text" placeholder="John Doe" className="login-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} color="var(--text-muted)" className="input-icon" />
              <input type="email" placeholder="name@example.com" className="login-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} color="var(--text-muted)" className="input-icon" />
              <input type="password" placeholder="••••••••" className="login-input" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" style={{ borderRadius: '15px' }}>
            Create Account
          </button>
        </form>

        <div className="login-footer">
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  roleSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    background: 'var(--background)',
    padding: '0.5rem',
    borderRadius: '16px',
  },
  roleBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.8rem',
    border: 'none',
    background: 'transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    color: 'var(--text-muted)',
    transition: 'all 0.3s ease',
  },
  activeRole: {
    background: 'var(--white)',
    color: 'var(--primary-blue)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  }
}

export default Register
