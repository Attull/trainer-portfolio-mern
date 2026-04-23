import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { api, assetUrl } from '../api.js';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get(`/blogs/${slug}`).then((res) => setBlog(res.data));
  }, [slug]);

  const likeBlog = async () => {
    const res = await api.post(`/blogs/${slug}/like`);
    setBlog((current) => ({ ...current, likes: res.data.likes }));
  };

  const addComment = async (event) => {
    event.preventDefault();
    setStatus('');
    const res = await api.post(`/blogs/${slug}/comments`, form);
    setBlog((current) => ({ ...current, comments: [...current.comments, res.data] }));
    setForm({ name: '', message: '' });
    setStatus('Comment added');
  };

  if (!blog) return <section className="section">Loading blog...</section>;

  return (
    <section className="article-shell">
      {blog.coverImage && <img className="article-cover" src={assetUrl(blog.coverImage)} alt={blog.title} />}
      <article className="article">
        <span className="category">{blog.category}</span>
        <h1>{blog.title}</h1>
        <p className="excerpt">{blog.excerpt}</p>
        <div className="article-actions">
          <button className="primary-button" onClick={likeBlog}><Heart size={18} /> Like {blog.likes}</button>
          <span><MessageCircle size={18} /> {blog.comments.length} comments</span>
        </div>
        <div className="article-content">
          {blog.content.split('\n').map((line, index) => <p key={index}>{line}</p>)}
        </div>
      </article>

      <section className="comments">
        <h2>Comments</h2>
        <form className="comment-form" onSubmit={addComment}>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Your name"
            required
          />
          <textarea
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder="Share your thought"
            required
          />
          <button className="primary-button" type="submit"><Send size={17} /> Post Comment</button>
          {status && <small>{status}</small>}
        </form>
        <div className="comment-list">
          {blog.comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <strong>{comment.name}</strong>
              <p>{comment.message}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
