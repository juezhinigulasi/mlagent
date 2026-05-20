'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  points: number;
  pointsLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshPoints: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [pointsLoading, setPointsLoading] = useState(true);

  const fetchPoints = async (userId: string) => {
    setPointsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('points')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('获取积分失败:', error);
        setPoints(0);
      } else {
        setPoints(data?.points || 0);
      }
    } catch (error) {
      console.error('获取积分失败:', error);
      setPoints(0);
    }
    setPointsLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await fetchPoints(user.id);
      }
      
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription: listener } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchPoints(session.user.id);
      } else {
        setPoints(0);
      }
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error: error?.message || null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && user) {
      await fetchPoints(user.id);
    }
    return { error: error?.message || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setPoints(0);
  };

  const refreshPoints = async () => {
    if (user) {
      await fetchPoints(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, points, pointsLoading, signUp, signIn, signOut, refreshPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
