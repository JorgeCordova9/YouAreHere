import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "./AuthForm";
import WelcomeScreen from "./WelcomeScreen";
import MetricsForm from "./MetricsForm";
import Dashboard from "./Dashboard";
import { UserMetrics } from "@/types/metrics";
import { Button } from "./ui/button";
import { LogOut, LogIn, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { saveUserMetrics } from "@/lib/dataStorage";

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
    // Check if Supabase is configured
    const isSupabaseConfigured = 
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (isSupabaseConfigured && !user) {
      setShowAuthDialog(true);
    } else {
      setAppState("form");
    }
  };

  const handleFormSubmit = async (metrics: UserMetrics) => {
    setUserMetrics(metrics);
    
    // Always save to localStorage for user's own reference
    localStorage.setItem("userMetrics", JSON.stringify(metrics));
    
    // Optionally save to database (only if Supabase is configured)
    // This data is stored but NOT used in comparisons until manually enabled
    try {
      await saveUserMetrics(metrics);
      console.log('User metrics saved to database for future analysis');
    } catch (error) {
      console.log('Database save skipped - using official data only');
    }
    
    setAppState("dashboard");
  };

  const handleReset = () => {
    setAppState("form");
  };

  const handleGoHome = () => {
    setAppState("welcome");
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
      {/* Header with Home and Auth buttons */}
      <div className="absolute top-4 left-4 z-10">
        {appState !== "welcome" && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleGoHome}
            className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-none shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <TrendingUp className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>
      
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
