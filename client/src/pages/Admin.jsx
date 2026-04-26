import { useEffect, useState } from 'react';
import { ImagePlus, LogIn, MessageSquareQuote, PlusCircle, Trash2 } from 'lucide-react';
import { api, assetUrl } from '../api.js';

const emptyBlog = { title: '', category: 'Learning', excerpt: '', content: '', tags: '', isPublished: true };
const emptyGallery = { title: '', description: '', trainingDate: '', location: '', audience: '', tags: '' };
const emptyReview = { studentName: '', email: '', course: '', headline: '', quote: '', source: '', rating: 5, isFeatured: true, isPublished: true };

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('trainer_admin_token') || '');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [blogImage, setBlogImage] = useState(null);
  const [galleryImage, setGalleryImage] = useState(null);
  const [reviewImage, setReviewImage] = useState(null);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    const [blogRes, galleryRes, reviewRes] = await Promise.all([
      api.get('/blogs?admin=true'),
      api.get('/gallery'),
      api.get('/reviews?admin=true')
    ]);
    setBlogs(blogRes.data);
    setGallery(galleryRes.data);
    setReviews(reviewRes.data);
  };

  useEffect(() => {
    if (token) loadAdminData();
  }, [token]);

  const loginAdmin = async (event) => {
    event.preventDefault();
    const res = await api.post('/auth/login', login);
    localStorage.setItem('trainer_admin_token', res.data.token);
    setToken(res.data.token);
    setMessage('Logged in');
  };

  const createBlog = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(blogForm).forEach(([key, value]) => data.append(key, value));
    if (blogImage) data.append('coverImage', blogImage);
    await api.post('/blogs', data);
    setBlogForm(emptyBlog);
    setBlogImage(null);
    setMessage('Blog created');
    loadAdminData();
  };

  const createGalleryItem = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(galleryForm).forEach(([key, value]) => data.append(key, value));
    if (galleryImage) data.append('image', galleryImage);
    await api.post('/gallery', data);
    setGalleryForm(emptyGallery);
    setGalleryImage(null);
    setMessage('Gallery photo added');
    loadAdminData();
  };

  const createReview = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(reviewForm).forEach(([key, value]) => data.append(key, value));
    if (reviewImage) data.append('screenshot', reviewImage);
    await api.post('/reviews', data);
    setReviewForm(emptyReview);
    setReviewImage(null);
    setMessage('Student review added');
    loadAdminData();
  };

  const deleteBlog = async (id) => {
    await api.delete(`/blogs/${id}`);
    loadAdminData();
  };

  const deleteGalleryItem = async (id) => {
    await api.delete(`/gallery/${id}`);
    loadAdminData();
  };

  const deleteReview = async (id) => {
    await api.delete(`/reviews/${id}`);
    loadAdminData();
  };

  if (!token) {
    return (
      <section className="admin-login">
        <form className="admin-form" onSubmit={loginAdmin}>
          <h1>Admin Login</h1>
          <input placeholder="Admin email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} />
          <input placeholder="Password" type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
          <button className="primary-button" type="submit"><LogIn size={18} /> Login</button>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="section-heading">
        <p className="eyebrow">Admin Studio</p>
        <h1>Manage blogs, training photos, and student reviews</h1>
        {message && <p>{message}</p>}
      </div>

      <div className="admin-grid admin-grid--triple">
        <form className="admin-form" onSubmit={createBlog}>
          <h2><PlusCircle size={20} /> New Blog</h2>
          <input placeholder="Title" value={blogForm.title} onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })} required />
          <input placeholder="Category" value={blogForm.category} onChange={(event) => setBlogForm({ ...blogForm, category: event.target.value })} />
          <input placeholder="Tags separated by comma" value={blogForm.tags} onChange={(event) => setBlogForm({ ...blogForm, tags: event.target.value })} />
          <textarea placeholder="Short excerpt" value={blogForm.excerpt} onChange={(event) => setBlogForm({ ...blogForm, excerpt: event.target.value })} required />
          <textarea className="tall" placeholder="Full blog content" value={blogForm.content} onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })} required />
          <label className="file-label">Cover image<input type="file" accept="image/*" onChange={(event) => setBlogImage(event.target.files[0])} /></label>
          <button className="primary-button" type="submit">Publish Blog</button>
        </form>

        <form className="admin-form" onSubmit={createGalleryItem}>
          <h2><ImagePlus size={20} /> New Training Photo</h2>
          <input placeholder="Training title" value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} required />
          <textarea placeholder="Description" value={galleryForm.description} onChange={(event) => setGalleryForm({ ...galleryForm, description: event.target.value })} />
          <input type="date" value={galleryForm.trainingDate} onChange={(event) => setGalleryForm({ ...galleryForm, trainingDate: event.target.value })} />
          <input placeholder="Location" value={galleryForm.location} onChange={(event) => setGalleryForm({ ...galleryForm, location: event.target.value })} />
          <input placeholder="Audience" value={galleryForm.audience} onChange={(event) => setGalleryForm({ ...galleryForm, audience: event.target.value })} />
          <input placeholder="Tags separated by comma" value={galleryForm.tags} onChange={(event) => setGalleryForm({ ...galleryForm, tags: event.target.value })} />
          <label className="file-label">Training image<input type="file" accept="image/*" onChange={(event) => setGalleryImage(event.target.files[0])} required /></label>
          <button className="primary-button" type="submit">Add Photo</button>
        </form>

        <form className="admin-form" onSubmit={createReview}>
          <h2><MessageSquareQuote size={20} /> New Student Review</h2>
          <input placeholder="Student name" value={reviewForm.studentName} onChange={(event) => setReviewForm({ ...reviewForm, studentName: event.target.value })} required />
          <input placeholder="Student email" value={reviewForm.email} onChange={(event) => setReviewForm({ ...reviewForm, email: event.target.value })} />
          <input placeholder="Course or session" value={reviewForm.course} onChange={(event) => setReviewForm({ ...reviewForm, course: event.target.value })} />
          <input placeholder="Short headline" value={reviewForm.headline} onChange={(event) => setReviewForm({ ...reviewForm, headline: event.target.value })} />
          <input placeholder="Source (WhatsApp, LinkedIn, Email)" value={reviewForm.source} onChange={(event) => setReviewForm({ ...reviewForm, source: event.target.value })} />
          <textarea placeholder="Optional quote or summary" value={reviewForm.quote} onChange={(event) => setReviewForm({ ...reviewForm, quote: event.target.value })} />
          <input type="number" min="1" max="5" placeholder="Rating" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })} />
          <label className="file-label">Review screenshot<input type="file" accept="image/*" onChange={(event) => setReviewImage(event.target.files[0])} required /></label>
          <button className="primary-button" type="submit">Add Review</button>
        </form>
      </div>

      <div className="manage-grid">
        <section>
          <h2>Existing Blogs</h2>
          {blogs.map((blog) => (
            <div className="manage-row" key={blog._id}>
              <span>{blog.title}</span>
              <button className="icon-button danger" onClick={() => deleteBlog(blog._id)} title="Delete blog"><Trash2 size={17} /></button>
            </div>
          ))}
        </section>
        <section>
          <h2>Gallery Photos</h2>
          {gallery.map((item) => (
            <div className="manage-row" key={item._id}>
              <img src={assetUrl(item.imageUrl)} alt={item.title} />
              <span>{item.title}</span>
              <button className="icon-button danger" onClick={() => deleteGalleryItem(item._id)} title="Delete photo"><Trash2 size={17} /></button>
            </div>
          ))}
        </section>
        <section>
          <h2>Student Reviews</h2>
          {reviews.map((review) => (
            <div className="manage-row" key={review._id}>
              {review.screenshotUrl
                ? <img src={assetUrl(review.screenshotUrl)} alt={review.studentName} />
                : <div className="manage-thumb-fallback">R</div>}
              <span>{review.studentName}{review.course ? ` - ${review.course}` : ''}</span>
              <button className="icon-button danger" onClick={() => deleteReview(review._id)} title="Delete review"><Trash2 size={17} /></button>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
