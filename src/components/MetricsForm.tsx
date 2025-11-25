import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserMetrics } from "@/types/metrics";
import { sectors, ageRanges, cities, currencies } from "@/lib/mockData";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MetricsFormProps {
  onSubmit: (metrics: UserMetrics) => void;
}

export default function MetricsForm({ onSubmit }: MetricsFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserMetrics>>({
    sector: "",
    ageRange: "",
    city: "",
    salary: 0,
    currency: "USD",
    netWorth: 0,
    rent: 0,
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit(formData as UserMetrics);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.sector !== "";
      case 2: return formData.ageRange !== "";
      case 3: return formData.city !== "";
      case 4: return formData.salary && formData.salary > 0;
      case 5: return formData.currency !== "";
      case 6: return formData.netWorth !== undefined && formData.netWorth >= 0;
      case 7: return formData.rent !== undefined && formData.rent >= 0;
      default: return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Card className="border-none shadow-xl bg-white">
        <CardHeader className="space-y-4 pb-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Share Your Metrics
            </CardTitle>
            <CardDescription className="text-center text-base">
              Step {step} of {totalSteps}
            </CardDescription>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-8 pb-8">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="sector" className="text-lg font-semibold">What sector do you work in?</Label>
                <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                  <SelectTrigger id="sector" className="h-12 text-base">
                    <SelectValue placeholder="Select your sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector} className="text-base">
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="ageRange" className="text-lg font-semibold">What's your age range?</Label>
                <Select value={formData.ageRange} onValueChange={(value) => setFormData({ ...formData, ageRange: value })}>
                  <SelectTrigger id="ageRange" className="h-12 text-base">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRanges.map((range) => (
                      <SelectItem key={range} value={range} className="text-base">
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg font-semibold">Where do you live?</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                  <SelectTrigger id="city" className="h-12 text-base">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city} className="text-base">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-lg font-semibold">What's your annual salary?</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g., 75000"
                  value={formData.salary || ""}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  className="h-12 text-base"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-lg font-semibold">Select your currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger id="currency" className="h-12 text-base">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code} className="text-base">
                        {curr.symbol} {curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="netWorth" className="text-lg font-semibold">What's your net worth?</Label>
                <Input
                  id="netWorth"
                  type="number"
                  placeholder="e.g., 150000"
                  value={formData.netWorth || ""}
                  onChange={(e) => setFormData({ ...formData, netWorth: Number(e.target.value) })}
                  className="h-12 text-base"
                />
                <p className="text-sm text-muted-foreground">Total assets minus liabilities</p>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label htmlFor="rent" className="text-lg font-semibold">What's your monthly rent/mortgage?</Label>
                <Input
                  id="rent"
                  type="number"
                  placeholder="e.g., 2000"
                  value={formData.rent || ""}
                  onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
                  className="h-12 text-base"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="h-12 px-6"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {step === totalSteps ? "View Results" : "Next"}
              {step !== totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
