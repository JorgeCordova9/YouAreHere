import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Users, Lock } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl mb-4">
            <TrendingUp className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Know Your Worth
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare your salary, net worth, and expenses anonymously with global data. 
            Get instant insights into where you stand.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="inline-block p-3 bg-blue-100 rounded-xl">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">100% Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                No accounts, no tracking. Your data is completely private and secure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="inline-block p-3 bg-cyan-100 rounded-xl">
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-lg">Real Comparisons</h3>
              <p className="text-sm text-muted-foreground">
                See how you compare to others in your sector, age group, and location.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="inline-block p-3 bg-green-100 rounded-xl">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Data is aggregated only. No personal information is ever stored.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 pt-8">
          <Button 
            onClick={onStart}
            size="lg"
            className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started - It's Free
          </Button>
          <p className="text-sm text-muted-foreground">
            Takes less than 2 minutes • No sign-up required
          </p>
        </div>

        {/* Privacy Notice */}
        <Card className="border-blue-200 bg-blue-50/50 mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Your Privacy is Protected</h4>
                <p className="text-sm text-blue-800">
                  We don't collect any personally identifiable information. All data is anonymous and used 
                  only for aggregated statistics. You can optionally save your entries locally in your browser 
                  for future reference, but nothing is sent to our servers beyond the anonymous metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
