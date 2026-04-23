import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { api, assetUrl } from '../api.js';

export default function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/gallery').then((res) => setItems(res.data));
  }, []);

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Training Gallery</p>
        <h1>Photos from conducted trainings</h1>
        <p>Add workshop images from the admin panel and keep your training journey visible.</p>
      </div>

      <div className="gallery-grid">
        {items.map((item) => (
          <article className="gallery-card" key={item._id}>
            <img src={assetUrl(item.imageUrl)} alt={item.title} />
            <div className="gallery-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="meta-list">
                {item.trainingDate && <span><CalendarDays size={15} /> {new Date(item.trainingDate).toLocaleDateString()}</span>}
                {item.location && <span><MapPin size={15} /> {item.location}</span>}
                {item.audience && <span><Users size={15} /> {item.audience}</span>}
              </div>
              <div className="tag-row">{item.tags?.map((tag) => <small key={tag}>{tag}</small>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
