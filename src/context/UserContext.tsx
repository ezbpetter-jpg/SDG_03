"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Language, translations, TranslationDictionary } from "@/lib/i18n/translations";

export interface User {
  id: number;
  name: string;
  email: string;
  isDemo?: boolean;
}

export interface HealthProfile {
  age: number | null;
  gender: string | null;
  conditions: string[];
  allergies: string[];
  current_medications: string[];
  updated_at?: string | null;
}

interface UserContextType {
  user: User | null;
  profile: HealthProfile | null;
  isLoading: boolean;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  login: (user: User, profile?: HealthProfile) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (profile: Partial<HealthProfile>) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "tabibcare_user";
const LANG_STORAGE_KEY = "tabibcare_lang";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLangState] = useState<Language>("en");

  // Synchronize document dir and lang attributes
  const applyLanguageAttributes = useCallback((language: Language) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
      if (language === "ur") {
        document.body.classList.add("lang-ur");
      } else {
        document.body.classList.remove("lang-ur");
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    applyLanguageAttributes(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    }
  };

  const t = useCallback(
    (key: keyof TranslationDictionary): string => {
      const dict = translations[lang] || translations.en;
      return dict[key] || translations.en[key] || String(key);
    },
    [lang]
  );

  const fetchProfile = async (userId: number) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile in context:", err);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
      if (savedLang === "en" || savedLang === "ur") {
        setLangState(savedLang);
        applyLanguageAttributes(savedLang);
      } else {
        // Default to English explicitly
        applyLanguageAttributes("en");
      }

      if (stored) {
        const parsedUser = JSON.parse(stored) as User;
        setUser(parsedUser);
        fetchProfile(parsedUser.id);
      }
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
    } finally {
      setIsLoading(false);
    }
  }, [applyLanguageAttributes]);

  const login = (newUser: User, initialProfile?: HealthProfile) => {
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    }
    if (initialProfile) {
      setProfile(initialProfile);
    } else {
      fetchProfile(newUser.id);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const updateProfile = async (updatedFields: Partial<HealthProfile>): Promise<boolean> => {
    if (!user) return false;
    try {
      const merged = {
        userId: user.id,
        age: updatedFields.age !== undefined ? updatedFields.age : profile?.age,
        gender: updatedFields.gender !== undefined ? updatedFields.gender : profile?.gender,
        conditions: updatedFields.conditions ?? profile?.conditions ?? [],
        allergies: updatedFields.allergies ?? profile?.allergies ?? [],
        current_medications: updatedFields.current_medications ?? profile?.current_medications ?? [],
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update profile:", err);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        isLoading,
        lang,
        setLang,
        t,
        login,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
