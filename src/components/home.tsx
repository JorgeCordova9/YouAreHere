import { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import MetricsForm from "./MetricsForm";
import Dashboard from "./Dashboard";
import { UserMetrics } from "@/types/metrics";

type AppState = "welcome" | "form" | "dashboard";

function Home() {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedMetrics = localStorage.getItem("userMetrics");
    if (savedMetrics) {
      try {
        const parsed = JSON.parse(savedMetrics);
        setUserMetrics(parsed);
        // Optionally auto-navigate to dashboard if data exists
        // setAppState("dashboard");
      } catch (e) {
        console.error("Failed to parse saved metrics", e);
      }
    }
  }, []);

  const handleStart = () => {
    setAppState("form");
  };

  const handleFormSubmit = (metrics: UserMetrics) => {
    setUserMetrics(metrics);
    // Save to localStorage
    localStorage.setItem("userMetrics", JSON.stringify(metrics));
    setAppState("dashboard");
  };

  const handleReset = () => {
    setAppState("form");
  };

  return (
    <div className="min-h-screen bg-white">
      {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}
      
      {appState === "form" && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12">
          <MetricsForm onSubmit={handleFormSubmit} />
        </div>
      )}
      
      {appState === "dashboard" && userMetrics && (
        <Dashboard userMetrics={userMetrics} onReset={handleReset} />
      )}
    </div>
  );
}

export default Home;
