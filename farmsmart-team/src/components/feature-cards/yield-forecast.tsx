"use client";

import * as React from "react";
import { useTransition } from "react";
import { forecastCropYield, type CropYieldOutput } from "@/ai/flows/crop-yield-forecasting";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CalendarDays, Sprout, Wheat } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function YieldForecastCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = React.useState<CropYieldOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cropType = formData.get("cropType") as string;
    const weatherPatterns = formData.get("weatherPatterns") as string;
    const soilData = formData.get("soilData") as string;
    const historicalYieldData = formData.get("historicalYieldData") as string;
    const fertilizerRecommendations = formData.get("fertilizerRecommendations") as string;
    
    setResult(null);
    setError(null);

    startTransition(async () => {
      try {
        const prediction = await forecastCropYield({ 
          cropType, 
          weatherPatterns, 
          soilData, 
          historicalYieldData,
          fertilizerRecommendations,
        });
        setResult(prediction);
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Forecast Crop Yield</CardTitle>
          <CardDescription>
            Provide farm data to receive an AI-driven yield forecast and optimal schedules.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Input id="cropType" name="cropType" placeholder="e.g., Soybean, Rice" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weatherPatterns">Weather Patterns</Label>
              <Textarea id="weatherPatterns" name="weatherPatterns" placeholder="e.g., Consistent sunshine, expecting monsoon in 2 weeks" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soilData">Soil Data</Label>
              <Textarea id="soilData" name="soilData" placeholder="e.g., Loamy soil, pH 6.5, high nitrogen content" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="historicalYieldData">Historical Yield Data (Optional)</Label>
              <Textarea id="historicalYieldData" name="historicalYieldData" placeholder="e.g., Average yield over last 3 years was 2.5 tons/acre." />
            </div>
             <div className="space-y-2">
              <Label htmlFor="fertilizerRecommendations">Fertilizer Recommendations (Optional)</Label>
              <Textarea id="fertilizerRecommendations" name="fertilizerRecommendations" placeholder="e.g., Applied NPK fertilizer at 120:60:60 kg/ha." />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Forecasting...' : 'Forecast Yield'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Yield Forecast Report</CardTitle>
          <CardDescription>
            AI-generated forecast and schedules will be shown here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Wheat className="h-5 w-5 text-primary" /> Predicted Yield</h3>
                <p className="text-2xl font-bold text-primary">
                  {result.predictedYield}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Sprout className="h-5 w-5 text-muted-foreground" /> Optimal Planting Schedule</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.optimalPlantingSchedule}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-muted-foreground" /> Harvesting Schedule</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.harvestingSchedule}</p>
              </div>
            </div>
          )}
          {!isPending && !result && !error && (
            <div className="text-center text-muted-foreground py-12">
              <p>Your yield forecast is waiting for data input.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
