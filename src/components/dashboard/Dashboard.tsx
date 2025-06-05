import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from 'store';
import type { AppDispatch } from 'store';
import { clearError } from 'store/authSlice';
import { logout } from 'store/authThunk';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div />
        <div className="dashboard-user" ref={avatarRef}>
          <div className="user-info">
            <div className="user-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-status">Available</div>
          </div>
          <img
            src={'/avatar-default.png'}
            alt="avatar"
            className="user-avatar"
            onClick={() => setShowMenu((v) => !v)}
            style={{ cursor: 'pointer' }}
          />
          {showMenu && (
            <div className="logout-menu">
              <button
                className="logout-btn"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        <h2>Welcome to Demo App</h2>
        <img
          src="/background-dashboard.png"
          alt="Dashboard Illustration"
          className="dashboard-illustration"
        />
      </main>

      <footer className="dashboard-footer">
        COPYRIGHT © 2020
      </footer>
    </div>
  );
};

export default Dashboard; 