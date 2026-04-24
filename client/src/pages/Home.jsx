import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Mail, MapPin, Phone, Quote, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../api.js';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    Promise.all([api.get('/profile'), api.get('/reviews')]).then(([profileRes, reviewRes]) => {
      setProfile(profileRes.data);
      setReviews(reviewRes.data);
    });
  }, []);

  const currentReview = useMemo(() => reviews[activeReview] || null, [reviews, activeReview]);

  const moveReview = (direction) => {
    setActiveReview((current) => {
      if (!reviews.length) return 0;
      return (current + direction + reviews.length) % reviews.length;
    });
  };

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

      {currentReview && (
        <section className="section reviews-band">
          <div className="section-heading">
            <p className="eyebrow"><Quote size={16} /> Student Reviews</p>
            <h1>Proof from real learner feedback</h1>
            <p>Upload screenshots of student messages, LinkedIn recommendations, or classroom feedback and feature them here.</p>
          </div>

          <div className="review-showcase">
            <div className="review-copy">
              <div className="review-stars">
                {Array.from({ length: currentReview.rating || 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
              </div>
              <h2>{currentReview.headline || `Feedback from ${currentReview.studentName}`}</h2>
              {currentReview.quote && <p>{currentReview.quote}</p>}
              <div className="review-credit">
                <strong>{currentReview.studentName}</strong>
                {currentReview.source && <span>{currentReview.source}</span>}
              </div>
              {reviews.length > 1 && (
                <div className="review-controls">
                  <button className="icon-button" onClick={() => moveReview(-1)} title="Previous review">
                    <ArrowLeft size={18} />
                  </button>
                  <button className="icon-button" onClick={() => moveReview(1)} title="Next review">
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="review-media">
              <img src={assetUrl(currentReview.screenshotUrl)} alt={`Review from ${currentReview.studentName}`} />
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="review-dots">
              {reviews.map((review, index) => (
                <button
                  key={review._id}
                  className={index === activeReview ? 'review-dot active' : 'review-dot'}
                  onClick={() => setActiveReview(index)}
                  title={`Show review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

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
