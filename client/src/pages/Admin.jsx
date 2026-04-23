import { useEffect, useState } from 'react';
import { ImagePlus, LogIn, PlusCircle, Trash2 } from 'lucide-react';
import { api, assetUrl } from '../api.js';

const emptyBlog = { title: '', category: 'Learning', excerpt: '', content: '', tags: '', isPublished: true };
const emptyGallery = { title: '', description: '', trainingDate: '', location: '', audience: '', tags: '' };

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('trainer_admin_token') || '');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogForm, setBlogForm] = useState(emptyBlog);
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [blogImage, setBlogImage] = useState(null);
  const [galleryImage, setGalleryImage] = useState(null);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    const [blogRes, galleryRes] = await Promise.all([
      api.get('/blogs?admin=true'),
      api.get('/gallery')
    ]);
    setBlogs(blogRes.data);
    setGallery(galleryRes.data);
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

  const deleteBlog = async (id) => {
    await api.delete(`/blogs/${id}`);
    loadAdminData();
  };

  const deleteGalleryItem = async (id) => {
    await api.delete(`/gallery/${id}`);
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
        <h1>Manage blogs and training photos</h1>
        {message && <p>{message}</p>}
      </div>

      <div className="admin-grid">
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
      </div>
    </section>
  );
}
