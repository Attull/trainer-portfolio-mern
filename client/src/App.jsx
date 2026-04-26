import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Dumbbell, GraduationCap, Image, LogOut, MessageSquareHeart, NotebookPen, ShieldCheck } from 'lucide-react';
import Home from './pages/Home.jsx';
import Blogs from './pages/Blogs.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Admin from './pages/Admin.jsx';
import FeedbackForm from './pages/FeedbackForm.jsx';
import Reviews from './pages/Reviews.jsx';

function Header() {
  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem('trainer_admin_token'));

  const logout = () => {
    localStorage.removeItem('trainer_admin_token');
    navigate('/');
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark"><GraduationCap size={22} /></span>
        <span>Trainer Portfolio</span>
      </Link>
      <nav className="nav">
        <NavLink to="/">Profile</NavLink>
        <NavLink to="/gallery"><Image size={17} /> Gallery</NavLink>
        <NavLink to="/blogs"><NotebookPen size={17} /> Blogs</NavLink>
        <NavLink to="/reviews"><MessageSquareHeart size={17} /> Reviews</NavLink>
        <NavLink to="/feedback">Give Feedback</NavLink>
        <NavLink to="/admin"><ShieldCheck size={17} /> Admin</NavLink>
        {isAdmin && (
          <button className="icon-button" onClick={logout} title="Log out">
            <LogOut size={18} />
          </button>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Dumbbell size={18} />
      <span>Built for sharing training work, learning notes, and community discussion.</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
