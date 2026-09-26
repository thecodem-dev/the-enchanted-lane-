import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabase";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  userId: string | null;
  /** The traveller's first name only — this is what the rest of the app should display. */
  firstName: string | null;
  lastName: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const FIRST_NAME_KEY = "enchanted-line:traveller-first-name";
const LAST_NAME_KEY = "enchanted-line:traveller-last-name";

function readLocalName(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [firstName, setFirstName] = useState<string | null>(() =>
    isSupabaseConfigured ? null : readLocalName(FIRST_NAME_KEY),
  );
  const [lastName, setLastName] = useState<string | null>(() =>
    isSupabaseConfigured ? null : readLocalName(LAST_NAME_KEY),
  );

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (!error) setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      if (isSupabaseConfigured) {
        setFirstName(null);
        setLastName(null);
      }
      return;
    }

    const firstNameKey = `${FIRST_NAME_KEY}:${user.id}`;
    const lastNameKey = `${LAST_NAME_KEY}:${user.id}`;
    const metadataFirst = typeof user.user_metadata.first_name === "string"
      ? user.user_metadata.first_name
      : null;
    const metadataLast = typeof user.user_metadata.last_name === "string"
      ? user.user_metadata.last_name
      : null;
    setFirstName(readLocalName(firstNameKey) ?? metadataFirst);
    setLastName(readLocalName(lastNameKey) ?? metadataLast);

    let active = true;
    void supabase?.from("profiles").select("first_name, last_name").eq("id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!active || error || !data) return;
        setFirstName(data.first_name || metadataFirst);
        setLastName(data.last_name || metadataLast);
      });

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    try {
      if (!isSupabaseConfigured) {
        if (firstName) localStorage.setItem(FIRST_NAME_KEY, firstName);
        else localStorage.removeItem(FIRST_NAME_KEY);
        if (lastName) localStorage.setItem(LAST_NAME_KEY, lastName);
        else localStorage.removeItem(LAST_NAME_KEY);
      } else if (user) {
        const firstNameKey = `${FIRST_NAME_KEY}:${user.id}`;
        const lastNameKey = `${LAST_NAME_KEY}:${user.id}`;
        if (firstName) localStorage.setItem(firstNameKey, firstName);
        if (lastName) localStorage.setItem(lastNameKey, lastName);
      }
    } catch {
      // Keep authentication usable if local storage is unavailable.
    }
  }, [firstName, lastName, user]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      const localName = email.trim().split("@")[0] || "Traveller";
      setFirstName(localName);
      setLastName(null);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    setUser(data.user);
  };

  const signUp = async (first: string, last: string, email: string, password: string) => {
    if (!supabase) {
      setFirstName(first);
      setLastName(last);
      return false;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { first_name: first, last_name: last } },
    });
    if (error) throw error;

    if (data.session) {
      setUser(data.user);
      setFirstName(first);
      setLastName(last);
    }
    return !data.session;
  };

  const signOut = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
    setFirstName(null);
    setLastName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isSupabaseConfigured ? user !== null : firstName !== null,
        isLoading,
        isConfigured: isSupabaseConfigured,
        userId: user?.id ?? null,
        firstName,
        lastName,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
