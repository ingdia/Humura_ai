import React from 'react'
import { 
  Activity, MessageSquare, Calendar, Star, TrendingUp, 
  Smile, Frown, Meh, AlertCircle, Clock
} from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard-container fade-in">
      <div className="container">
        {/* Welcome Header */}
        <header className="dash-header">
          <div>
            <h1>Good morning, <span style={{ color: 'var(--primary-blue)' }}>John</span></h1>
            <p>How are you feeling today? Take a moment to log your mood.</p>
          </div>
          <div className="mood-quick-log">
            <button className="mood-btn"><Smile size={24} color="#6BCB77" /></button>
            <button className="mood-btn"><Meh size={24} color="#FFD93D" /></button>
            <button className="mood-btn"><Frown size={24} color="#FF6B6B" /></button>
          </div>
        </header>

        <div className="dash-grid">
          {/* Main Column */}
          <div className="dash-main">
            {/* AI Companion Card */}
            <div className="glass-card ai-promo-card">
              <div className="ai-promo-content">
                <span className="pill-box" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>AI Companion</span>
                <h2 style={{ color: 'white', fontSize: '2rem' }}>Humura is here to listen</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Feeling overwhelmed? Have a quick chat with our AI to clear your mind.</p>
                <button className="btn" style={{ background: 'white', color: 'var(--primary-blue)', marginTop: '1rem' }}>
                  Start Conversation
                </button>
              </div>
              <div className="ai-promo-icon">
                 <MessageSquare size={80} color="white" style={{ opacity: 0.3 }} />
              </div>
            </div>

            {/* Mood Trends */}
            <div className="glass-card" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={20} color="var(--primary-blue)" />
                  Mood Trends
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
              </div>
              <div className="chart-placeholder">
                 {/* Visual representation of a chart */}
                 <div className="chart-bar" style={{ height: '40%' }}></div>
                 <div className="chart-bar" style={{ height: '60%' }}></div>
                 <div className="chart-bar" style={{ height: '50%' }}></div>
                 <div className="chart-bar" style={{ height: '80%' }}></div>
                 <div className="chart-bar" style={{ height: '70%' }}></div>
                 <div className="chart-bar" style={{ height: '90%' }}></div>
                 <div className="chart-bar active" style={{ height: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="dash-sidebar">
            {/* Upcoming Appointment */}
            <div className="glass-card">
               <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--primary-blue)" />
                  Next Session
               </h3>
               <div className="session-card">
                  <div className="session-info">
                    <p style={{ fontWeight: 700 }}>Dr. Emily Watson</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clinical Psychologist</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--primary-blue)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <Clock size={16} />
                      Tomorrow, 10:00 AM
                    </div>
                  </div>
               </div>
               <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', borderRadius: '12px' }}>
                  Join Session
               </button>
            </div>

            {/* Emergency Hotline */}
            <div className="glass-card" style={{ marginTop: '2rem', background: '#FFF5F5', border: '1px solid #FED7D7' }}>
               <h3 style={{ fontSize: '1.1rem', color: '#C53030', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} />
                  Emergency?
               </h3>
               <p style={{ fontSize: '0.85rem', color: '#9B2C2C', marginTop: '0.5rem' }}>
                  If you are in immediate danger, please contact local emergency services.
               </p>
               <button className="btn" style={{ width: '100%', marginTop: '1rem', background: '#C53030', color: 'white', borderRadius: '12px' }}>
                  Get Immediate Help
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
