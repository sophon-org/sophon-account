"use client";

import { useState, useEffect } from "react";
import "./page.css";
import {
  SophonWidget,
  SophonEmbeddedWidget,
  SophonAccountProfile,
  useSophonContext,
  getAuthToken,
} from "@sophon-labs/react";
import ExampleMethods from "@/components/methods";
const checkIsDarkSchemePreferred = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false;
  }
  return false;
};

export default function Main() {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkSchemePreferred);
  const { setShowSophonAccountProfile } = useSophonContext();

  const token = getAuthToken();
  console.log("token", token);
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleChange = () => setIsDarkMode(checkIsDarkSchemePreferred());

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className={`container ${isDarkMode ? "dark" : "light"}`}>
      <div className="modal">
        <SophonWidget />
        <ExampleMethods isDarkMode={isDarkMode} />
      </div>
      <div>
        <SophonEmbeddedWidget />
      </div>
      <div>
        <h2>Account Profile</h2>
        <button onClick={() => setShowSophonAccountProfile(true)}>
          Show Profile
        </button>
        <SophonAccountProfile />
      </div>
      <div className="footer">
        <div className="footer-text">Made with ❤️ by Sophon Team</div>
      </div>
    </div>
  );
}
