import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken } from '../services/api';
import {
  supabase,
  isSupabaseConfigured,
  signInWithGoogleViaSupabase,
  signOutViaSupabase,
  signInWithEmailViaSupabase,
  signUpWithEmailViaSupabase,
} from '../services/supabaseClient';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
  const [authModalNotice, setAuthModalNotice] = useState('');
  const [authModalInitialTab, setAuthModalInitialTab] = useState('signin');

  const checkAuth = async () => {
    try {
      setLoading(true);

      // 1. First check if Supabase session is active
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const supaUser = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              'User',
            email: session.user.email,
            profileImage:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.email)}`,
            authProvider: session.user.app_metadata?.provider || 'supabase',
          };
          setUser(supaUser);
          setAuthToken(session.access_token);
          setLoading(false);
          return;
        }
      }

      // 2. Otherwise check backend session / stored token
      const res = await authAPI.getMe();
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen to Supabase Auth state changes if configured
    let authListener = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          const supaUser = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              'User',
            email: session.user.email,
            profileImage:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.email)}`,
            authProvider: session.user.app_metadata?.provider || 'supabase',
          };
          setUser(supaUser);
          setAuthToken(session.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAuthToken(null);
        }
      });
      authListener = data?.subscription;
    }

    // Check if redirected because Google OAuth was not configured in .env
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauthNotConfigured') === 'true' || params.get('authModal') === 'true') {
      setAuthModalNotice(
        'Google OAuth credentials are not set yet. You can sign in or sign up with email and password below, or use the 1-Click Demo account!'
      );
      setIsAuthModalOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (params.get('loginSuccess') === 'true') {
      toast.success('Successfully authenticated!');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const openAuthModal = (notice = '', tab = 'signin') => {
    setAuthModalNotice(notice);
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalNotice('');
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      try {
        await signInWithGoogleViaSupabase();
        return;
      } catch (err) {
        toast.error('Supabase Google OAuth error: ' + err.message);
      }
    } else {
      // Direct redirect to backend Google OAuth or inform user
      window.location.href = '/api/auth/google';
    }
  };

  const registerUser = async ({ name, email, password }) => {
    try {
      setLoading(true);

      // Attempt backend register
      try {
        const res = await authAPI.register({ name, email, password });
        if (res.data?.token) {
          setAuthToken(res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      } catch (backendErr) {
        // If backend failed and Supabase is configured, fallback to Supabase
        if (isSupabaseConfigured) {
          const res = await signUpWithEmailViaSupabase(name, email, password);
          const newUser = {
            id: res.user?.id,
            name: name,
            email: email,
            profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
            authProvider: 'supabase',
          };
          setUser(newUser);
          return newUser;
        }
        throw backendErr;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      setLoading(true);

      try {
        const res = await authAPI.login({ email, password });
        if (res.data?.token) {
          setAuthToken(res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      } catch (backendErr) {
        // If backend login failed and Supabase is configured, fallback to Supabase
        if (isSupabaseConfigured) {
          const res = await signInWithEmailViaSupabase(email, password);
          const supaUser = {
            id: res.user?.id,
            name: res.user?.user_metadata?.full_name || email.split('@')[0],
            email: res.user?.email,
            profileImage:
              res.user?.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
            authProvider: 'supabase',
          };
          setUser(supaUser);
          if (res.session?.access_token) {
            setAuthToken(res.session.access_token);
          }
          return supaUser;
        }
        throw backendErr;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyGoogleLogin = async (credential) => {
    try {
      setLoading(true);
      const res = await authAPI.verifyGoogle(credential);
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    try {
      setLoading(true);
      let userObj = null;

      try {
        const res = await authAPI.demoLogin();
        if (res.data?.token) {
          setAuthToken(res.data.token);
        }
        userObj = res.data.user;
      } catch (apiErr) {
        // Standalone offline demo user fallback for static Vercel preview
        userObj = {
          _id: 'demo-dev-user-001',
          name: 'Alex Rivera (Demo)',
          email: 'alex.rivera@example.com',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          authProvider: 'demo',
          isDemoUser: true,
        };
        setAuthToken('demo-token-bypass-key');
      }

      setUser(userObj);
      toast.success('Signed in with Demo Developer Account!');
      return userObj;
    } catch (err) {
      toast.error('Failed to initiate demo session: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthToken(null);
      if (isSupabaseConfigured) {
        await signOutViaSupabase();
      }
      try {
        await authAPI.logout();
      } catch {
        // Backend might be offline in pure client preview
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
        authModalNotice,
        authModalInitialTab,
        openAuthModal,
        closeAuthModal,
        isSupabaseConfigured,
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
