import { useEffect, useState } from 'react';
import { ArrowRight, Award, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/profile').then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <section className="section">Loading profile...</section>;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={16} /> Trainer Profile</p>
          <h1>{profile.name}</h1>
          <h2>{profile.role}</h2>
          <p>{profile.summary}</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/gallery">View Training Photos <ArrowRight size={18} /></Link>
            <Link className="secondary-button" to="/blogs">Read Blogs</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="portrait-frame">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1100&q=80"
              alt="Trainer conducting a professional workshop"
            />
          </div>
        </div>
      </section>

      <section className="stats-band">
        {profile.stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section two-column">
        <div>
          <p className="eyebrow"><Award size={16} /> Expertise</p>
          <h2>Training that turns concepts into confident practice.</h2>
          <p>
            Use this space to present your experience, session style, target audience,
            certifications, and the kind of transformation learners can expect.
          </p>
        </div>
        <div className="skill-grid">
          {profile.skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </section>

      <section className="contact-band">
        <div>
          <h2>Available for workshops, mentoring, and training partnerships.</h2>
          <p><MapPin size={17} /> {profile.location}</p>
        </div>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
          <a href={`tel:${profile.phone}`}><Phone size={18} /> {profile.phone}</a>
        </div>
      </section>
    </>
  );
}
