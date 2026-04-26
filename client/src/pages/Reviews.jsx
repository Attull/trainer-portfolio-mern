import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareHeart, Star } from 'lucide-react';
import { api, assetUrl } from '../api.js';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get('/reviews').then((res) => setReviews(res.data));
  }, []);

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow"><MessageSquareHeart size={16} /> All Feedback</p>
        <h1>What students are saying</h1>
        <p>Browse published feedback from learners across workshops, mentoring sessions, and technical training programs.</p>
      </div>

      <div className="review-page-actions">
        <Link className="primary-button" to="/feedback">Give Your Feedback</Link>
      </div>

      <div className="review-list-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review._id}>
            <div className="review-card-header">
              <div>
                <h2>{review.studentName}</h2>
                {review.course && <p>{review.course}</p>}
              </div>
              <div className="review-stars">
                {Array.from({ length: review.rating || 5 }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}
              </div>
            </div>

            {review.headline && <strong className="review-headline">{review.headline}</strong>}
            <p className="review-message">{review.quote}</p>

            {review.screenshotUrl && (
              <img className="review-card-image" src={assetUrl(review.screenshotUrl)} alt={`Feedback from ${review.studentName}`} />
            )}

            <div className="review-card-meta">
              {review.source && <span>{review.source}</span>}
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
