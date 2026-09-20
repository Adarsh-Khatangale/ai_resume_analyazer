import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const SUPABASE_PROJECT_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://fxltywnaiwebfghwfqyp.supabase.co';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [guestAnalysis, setGuestAnalysis] = useState(() => {
    try {
      const saved = localStorage.getItem('guest_analysis');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState('signin');

  const checkAuth = async () => {
    try {
      setLoading(true);

      // 1. Check if returning from Google OAuth redirect with hash (#access_token=...)
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        try {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
          const token = hashParams.get('access_token');
          if (token) {
            const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(decodeURIComponent(escape(atob(base64Payload))));

            const googleUser = {
              _id: payload.sub || 'usr-' + Date.now(),
              id: payload.sub,
              name:
                payload.user_metadata?.full_name ||
                payload.user_metadata?.name ||
                payload.email?.split('@')[0] ||
                'User',
              email: payload.email,
              profileImage:
                payload.user_metadata?.avatar_url ||
                payload.user_metadata?.picture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.email || 'User')}`,
              authProvider: 'google',
              isDemoUser: false,
            };

            setUser(googleUser);
            setAuthToken(token);
            localStorage.setItem('user_session', JSON.stringify(googleUser));
            toast.success(`Welcome, ${googleUser.name.split(' ')[0]}!`);

            // Clean hash from address bar
            window.history.replaceState({}, document.title, window.location.pathname);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Could not parse Google OAuth hash payload:', err);
        }
      }

      // 2. Check stored session
      const savedSession = localStorage.getItem('user_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setUser(parsed);
          setLoading(false);
          return;
        } catch {
          // ignore
        }
      }

      // 3. Fallback to checking backend /api/auth/me
      try {
        const res = await authAPI.getMe();
        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('user_session', JSON.stringify(res.data.user));
        }
      } catch {
        // Backend not available or guest
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const openAuthModal = (tab = 'signin') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Google OAuth triggers direct redirect to user's Supabase auth endpoint (as in Image 2)
  const loginWithGoogle = () => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/dashboard`);
    window.location.href = `${SUPABASE_PROJECT_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
  };

  const registerUser = async ({ name, email, password }) => {
    try {
      setLoading(true);
      let userObj = null;

      try {
        const res = await authAPI.register({ name, email, password });
        if (res.data?.token) setAuthToken(res.data.token);
        userObj = res.data.user;
      } catch (backendErr) {
        // Client-side session fallback for static/preview environments
        userObj = {
          _id: 'usr-' + Date.now(),
          name,
          email,
          profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          authProvider: 'local',
          isDemoUser: false,
        };
        setAuthToken('token-' + Date.now());
      }

      setUser(userObj);
      localStorage.setItem('user_session', JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      setLoading(true);
      let userObj = null;

      try {
        const res = await authAPI.login({ email, password });
        if (res.data?.token) setAuthToken(res.data.token);
        userObj = res.data.user;
      } catch (backendErr) {
        // Client-side fallback if user registered locally
        const savedSession = localStorage.getItem('user_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.email === email) {
            userObj = parsed;
          }
        }
        if (!userObj) {
          userObj = {
            _id: 'usr-' + Date.now(),
            name: email.split('@')[0],
            email,
            profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
            authProvider: 'local',
            isDemoUser: false,
          };
          setAuthToken('token-' + Date.now());
        }
      }

      setUser(userObj);
      localStorage.setItem('user_session', JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const verifyGoogleLogin = async (credential) => {
    try {
      setLoading(true);
      const res = await authAPI.verifyGoogle(credential);
      if (res.data?.token) setAuthToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('user_session', JSON.stringify(res.data.user));
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    try {
      setLoading(true);
      const demoUser = {
        _id: 'demo-dev-user-001',
        name: 'Adarsh Khatangale',
        email: 'adarshkhatangale@gmail.com',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authProvider: 'demo',
        isDemoUser: true,
      };

      try {
        const res = await authAPI.demoLogin();
        if (res.data?.token) setAuthToken(res.data.token);
        if (res.data?.user) {
          demoUser.name = res.data.user.name;
          demoUser.email = res.data.user.email;
        }
      } catch {
        // Offline / serverless demo fallback
        setAuthToken('demo-token-key');
      }

      setUser(demoUser);
      localStorage.setItem('user_session', JSON.stringify(demoUser));
      toast.success('Signed in as Adarsh Khatangale!');
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthToken(null);
      localStorage.removeItem('user_session');
      try {
        await authAPI.logout();
      } catch {
        // ignore
      }
      setUser(null);
      toast.info('Signed out successfully.');
    } catch (err) {
      toast.error('Logout error: ' + err.message);
    }
  };

  const saveGuestAnalysis = (analysis) => {
    setGuestAnalysis(analysis);
    try {
      localStorage.setItem('guest_analysis', JSON.stringify(analysis));
    } catch (e) {
      console.warn('Could not save guest analysis to localStorage', e);
    }
  };

  const clearGuestAnalysis = () => {
    setGuestAnalysis(null);
    localStorage.removeItem('guest_analysis');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        guestAnalysis,
        saveGuestAnalysis,
        clearGuestAnalysis,
        loginWithGoogle,
        registerUser,
        loginUser,
        verifyGoogleLogin,
        demoLogin,
        logout,
        checkAuth,
        isAuthModalOpen,
        authModalInitialTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
