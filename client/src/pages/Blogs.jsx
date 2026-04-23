import { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../api.js';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get('/blogs').then((res) => setBlogs(res.data));
  }, []);

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Learning Blog</p>
        <h1>Ideas, notes, and reflections</h1>
        <p>Write about any topic you are learning and let others interact through likes and comments.</p>
      </div>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <article className="blog-card" key={blog._id}>
            {blog.coverImage && <img src={assetUrl(blog.coverImage)} alt={blog.title} />}
            <div className="blog-body">
              <span className="category">{blog.category}</span>
              <h2><Link to={`/blogs/${blog.slug}`}>{blog.title}</Link></h2>
              <p>{blog.excerpt}</p>
              <div className="blog-meta">
                <span><Heart size={15} /> {blog.likes}</span>
                <span><MessageCircle size={15} /> {blog.comments?.length || 0}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
