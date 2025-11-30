import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserMetrics, PercentileData, GlobalStats } from "@/types/metrics";
import { getGlobalStats, calculateUserPercentiles, getDistributionData } from "@/lib/mockData";
import { CountryCode } from "@/lib/countryData";
import StatCard from "./StatCard";
import PercentileCard from "./PercentileCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, Home, Filter, RotateCcw } from "lucide-react";

interface DashboardProps {
  userMetrics: UserMetrics;
  onReset: () => void;
}

export default function Dashboard({ userMetrics, onReset }: DashboardProps) {
  const [filters, setFilters] = useState<{ countryData: CountryCode }>({ countryData: 'spain' });
  
  const globalStats = getGlobalStats(filters, userMetrics.currency);
  const percentiles = calculateUserPercentiles(userMetrics, filters);
  
  const formatCurrency = (value: number) => {
    const currencySymbols: Record<string, string> = {
      USD: "$", EUR: "€", GBP: "£", JPY: "¥", AUD: "A$", CAD: "C$", SGD: "S$"
    };
    const symbol = currencySymbols[userMetrics.currency] || "$";
    return `${symbol}${value.toLocaleString()}`;
  };

  const salaryDistribution = getDistributionData('salary', filters);
  const netWorthDistribution = getDistributionData('netWorth', filters);
  const rentDistribution = getDistributionData('rent', filters);

  const clearFilters = () => {
    setFilters({ countryData: 'spain' });
  };

  const hasActiveFilters = filters.countryData !== 'spain';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Your Financial Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              Compare your salary with official government statistics
            </p>
          </div>
          <Button onClick={onReset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Submit New Data
          </Button>
        </div>

        {/* Privacy Notice */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              🔒 <strong>Your privacy matters:</strong> All data is anonymous and aggregated. No personal information is stored or tracked.
            </p>
          </CardContent>
        </Card>

        {/* Country Selection */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Select Country
                </CardTitle>
                <CardDescription>Compare your salary with official government statistics</CardDescription>
              </div>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="ghost" size="sm" className="gap-2">
                  Reset to Spain
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={filters.countryData} onValueChange={(value) => setFilters({ countryData: value as CountryCode })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spain">Spain (Official INE 2023)</SelectItem>
                    <SelectItem value="usa">United States (Official BLS 2023)</SelectItem>
                    <SelectItem value="uk">United Kingdom (Official ONS 2023)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Official Data Info Banner */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-green-900">
              📊 <strong>Official Data:</strong> Comparing with official national salary data from {filters.countryData === 'spain' ? "Spain's INE (Instituto Nacional de Estadística)" : filters.countryData === 'usa' ? "US Bureau of Labor Statistics (BLS)" : "UK Office for National Statistics (ONS)"} - 2023. Salary percentiles are based on real government statistics.
            </p>
          </CardContent>
        </Card>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Average Salary"
            value={formatCurrency(globalStats.avgSalary)}
            subtitle={`Median: ${formatCurrency(globalStats.medianSalary)}`}
            icon={DollarSign}
          />
          <StatCard
            title="Average Net Worth"
            value={formatCurrency(globalStats.avgNetWorth)}
            subtitle={`Median: ${formatCurrency(globalStats.medianNetWorth)}`}
            icon={TrendingUp}
          />
          <StatCard
            title="Average Rent"
            value={formatCurrency(globalStats.avgRent)}
            subtitle={`Median: ${formatCurrency(globalStats.medianRent)}`}
            icon={Home}
          />
        </div>

        {/* Percentile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PercentileCard
            title="Salary Ranking"
            percentile={percentiles.salary}
            value={formatCurrency(userMetrics.salary)}
            description={`You earn more than ${percentiles.salary}% of people in ${filters.countryData === 'spain' ? 'Spain' : filters.countryData === 'usa' ? 'the United States' : 'the United Kingdom'}`}
          />
          <PercentileCard
            title="Net Worth Ranking"
            percentile={percentiles.netWorth}
            value={formatCurrency(userMetrics.netWorth)}
            description={`Your net worth exceeds ${percentiles.netWorth}% of people (estimated)`}
          />
          <PercentileCard
            title="Rent Ranking"
            percentile={percentiles.rent}
            value={formatCurrency(userMetrics.rent)}
            description={`Your rent is higher than ${percentiles.rent}% of people (estimated)`}
          />
        </div>

        {/* Charts */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Distribution Analysis</CardTitle>
            <CardDescription>See how metrics are distributed across the dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="salary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="salary">Salary</TabsTrigger>
                <TabsTrigger value="networth">Net Worth</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="salary" className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salaryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="url(#salaryGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="networth" className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={netWorthDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="rent" className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="url(#rentGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* User Info Summary */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sector</p>
                <p className="font-semibold">{userMetrics.sector}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age Range</p>
                <p className="font-semibold">{userMetrics.ageRange}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{userMetrics.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-semibold">{userMetrics.currency}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
