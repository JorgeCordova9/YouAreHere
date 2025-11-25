import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "./AuthForm";
import WelcomeScreen from "./WelcomeScreen";
import MetricsForm from "./MetricsForm";
import Dashboard from "./Dashboard";
import { UserMetrics } from "@/types/metrics";
import { Button } from "./ui/button";
import { LogOut, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type AppState = "welcome" | "form" | "dashboard";

function Home() {
  const { user, loading, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>("welcome");
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedMetrics = localStorage.getItem("userMetrics");
    if (savedMetrics) {
      try {
        const parsed = JSON.parse(savedMetrics);
        setUserMetrics(parsed);
      } catch (e) {
        console.error("Failed to parse saved metrics", e);
      }
    }
  }, []);

  const handleStart = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      setAppState("form");
    }
  };

  const handleFormSubmit = (metrics: UserMetrics) => {
    setUserMetrics(metrics);
    localStorage.setItem("userMetrics", JSON.stringify(metrics));
    setAppState("dashboard");
  };

  const handleReset = () => {
    setAppState("form");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Auth */}
      <div className="absolute top-4 right-4 z-10">
        {user ? (
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login / Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthForm onSuccess={() => setShowAuthDialog(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}
      
      {appState === "form" && user && (
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
