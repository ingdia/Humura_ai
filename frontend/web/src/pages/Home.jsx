import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, Shield, Brain, Activity, ArrowRight, Video, 
  Users, CheckCircle, Award, Star, Calendar, Play 
} from 'lucide-react'
import './Home.css'

import happyKid from '../assets/happy_kid_closeup.png'
import meditateImg from '../assets/meditate.png'

const Home = () => {
  return (
    <div className="fade-in">
      {/* Excellence Section (Top) */}
      <section style={{ padding: '40px 0 0' }}>
        <div className="container">
          <div className="excellence">
            <div className="excellence-item">
              <Award size={20} color="var(--primary-blue)" />
              National Excellence Award
            </div>
            <div className="excellence-item">
              <CheckCircle size={20} color="var(--primary-blue)" />
              Certified Support Provider
            </div>
            <div className="excellence-item">
              <Star size={20} color="var(--primary-blue)" />
              Best Mental Health Community
            </div>
          </div>
        </div>
      </section>

      {/* Main Hero Section - REDESIGNED */}
      <section className="hero">
        <div className="container hero-container" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'flex-start' }}>
          <div className="hero-content" style={{ marginTop: '4rem' }}>
            <h1 className="hero-title">
              A Journey to <br />
              <span style={{ color: 'var(--primary-blue)' }}>Mental Wellness</span>
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '500px' }}>
              Join over 50,000 active members in our healthy community. 
              Help is just a click away.
            </p>
            <div className="hero-btns" style={{ marginTop: '2.5rem' }}>
              <button className="btn btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '100px' }}>
                Get Started
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
          <div className="hero-image-wrapper">
             <div className="hero-bg-accent"></div>
             <img src={happyKid} alt="Happy Child Close-up" className="hero-main-img-refined" />
             <div className="book-schedule-card-refined">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ background: 'var(--soft-blue)', padding: '0.6rem', borderRadius: '10px' }}>
                    <Calendar size={20} color="var(--primary-blue)" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Book Schedule</h3>
                </div>
                <div className="avatars-overlap">
                  <div className="avatar" style={{ background: '#FFD1DC' }}></div>
                  <div className="avatar" style={{ background: '#D1E8FF' }}></div>
                  <div className="avatar" style={{ background: '#D1FFD1' }}></div>
                  <div className="avatar-plus">+12</div>
                </div>
                <button className="btn btn-outline" style={{ width: '100%', borderRadius: '12px', marginTop: '1.5rem', padding: '0.6rem' }}>
                  View All
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same but with refined styles */}
      <section className="section-padding">
        <div className="container meditate-section">
          <div className="meditate-image-wrapper">
            <img src={meditateImg} alt="Zen Meditation" className="meditate-img" />
            <div className="floating-btn-play">
              <Play size={24} fill="white" />
            </div>
          </div>
          <div>
            <span className="pill-box">Therapy Session</span>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>You Deserve to be Mentally Healthy</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.8 }}>
              Discover the heart behind our mental health platform. At our core, we are a compassionate community of experts dedicated to guiding you on your journey to emotional well-being and resilience.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <FeatureMini icon={<Shield size={24} />} title="Confidentiality" />
              <FeatureMini icon={<Users size={24} />} title="Community" />
              <FeatureMini icon={<Activity size={24} />} title="Accessibility" />
              <FeatureMini icon={<Award size={24} />} title="Expertise" />
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="section-padding" style={{ background: 'var(--background)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="pill-box" style={{ background: 'var(--white)' }}>Issues We Tackle</span>
            <h2 style={{ fontSize: '3rem' }}>Common Mental Health Issues</h2>
          </div>
          
          <div className="special-grid">
            <SpecialCard title="Depression" img="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
            <SpecialCard title="Anxiety" img="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
            <SpecialCard title="Relationship Issues" img="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
            <SpecialCard title="Grief & Loss" img="https://images.unsplash.com/photo-1541170155377-1a699bce6029?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureMini = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
    <div style={{ color: 'var(--primary-blue)' }}>{icon}</div>
    <span style={{ fontWeight: 600 }}>{title}</span>
  </div>
)

const SpecialCard = ({ title, img }) => (
  <div className="special-card">
    <img src={img} alt={title} />
    <div className="special-info">
      <h3>{title}</h3>
      <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1rem' }}>Expert support for {title.toLowerCase()}.</p>
      <button className="btn btn-outline" style={{ border: '1px solid white', color: 'white', padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
        Contact Us
      </button>
    </div>
  </div>
)

export default Home
