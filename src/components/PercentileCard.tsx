import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PercentileCardProps {
  title: string;
  percentile: number;
  value: string;
  description: string;
}

export default function PercentileCard({ title, percentile, value, description }: PercentileCardProps) {
  const getPercentileColor = (p: number) => {
    if (p >= 75) return "from-green-500 to-emerald-500";
    if (p >= 50) return "from-blue-500 to-cyan-500";
    if (p >= 25) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getTextColor = (p: number) => {
    if (p >= 75) return "text-green-600";
    if (p >= 50) return "text-blue-600";
    if (p >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">{value}</span>
            <span className={`text-3xl font-bold ${getTextColor(percentile)}`}>
              {percentile}%
            </span>
          </div>
          <div className="relative">
            <Progress value={percentile} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getPercentileColor(percentile)} transition-all duration-500`}
              style={{ width: `${percentile}%` }}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
