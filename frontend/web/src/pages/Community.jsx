import React from 'react'
import { MessageCircle, Heart, Share2, Search, PlusCircle } from 'lucide-react'
import './Community.css'

const Community = () => {
  return (
    <div className="community-container fade-in">
      <div className="container">
        <header className="comm-header">
          <div>
            <h1>Community <span style={{ color: 'var(--sage-green)' }}>Forum</span></h1>
            <p>A safe space to share your thoughts and support others.</p>
          </div>
          <button className="btn btn-primary">
            <PlusCircle size={20} />
            Create Post
          </button>
        </header>

        <div className="comm-search">
          <Search size={20} color="var(--text-muted)" />
          <input type="text" placeholder="Search for topics, support groups, or advice..." />
        </div>

        <div className="posts-feed">
          <PostCard 
            author="Sarah M."
            time="2 hours ago"
            content="Today I managed to meditate for 10 minutes straight. It's a small win, but it feels huge! 🌿"
            tags={['#Mindfulness', '#SmallWins']}
            likes={24}
            comments={5}
          />
          <PostCard 
            author="David K."
            time="5 hours ago"
            content="Does anyone have tips for managing work-related anxiety? Lately, it's been hard to stay focused."
            tags={['#WorkStress', '#Anxiety']}
            likes={12}
            comments={18}
          />
          <PostCard 
            author="Anonymous"
            time="1 day ago"
            content="Grateful for this community. Reading your stories makes me feel less alone in my journey. Thank you all."
            tags={['#Gratitude', '#Healing']}
            likes={56}
            comments={9}
          />
        </div>
      </div>
    </div>
  )
}

const PostCard = ({ author, time, content, tags, likes, comments }) => (
  <div className="glass-card post-card">
    <div className="post-header">
      <div className="author-info">
        <div className="author-avatar">{author[0]}</div>
        <div>
          <p style={{ fontWeight: 700 }}>{author}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{time}</p>
        </div>
      </div>
    </div>
    <div className="post-content">
      <p>{content}</p>
      <div className="post-tags">
        {tags.map(tag => <span key={tag} className="post-tag">{tag}</span>)}
      </div>
    </div>
    <div className="post-footer">
      <button className="post-action">
        <Heart size={18} />
        {likes}
      </button>
      <button className="post-action">
        <MessageCircle size={18} />
        {comments}
      </button>
      <button className="post-action">
        <Share2 size={18} />
      </button>
    </div>
  </div>
)

export default Community
