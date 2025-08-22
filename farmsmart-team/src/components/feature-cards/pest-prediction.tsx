"use client";

import * as React from "react";
import { useTransition } from "react";
import { predictPestAttack, type PredictPestAttackOutput } from "@/ai/flows/pest-attack-prediction";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Bug, ShieldCheck, Siren } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PestPredictionCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = React.useState<PredictPestAttackOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cropType = formData.get("cropType") as string;
    const location = formData.get("location") as string;
    const weatherData = formData.get("weatherData") as string;
    const historicalPestData = formData.get("historicalPestData") as string;
    
    setResult(null);
    setError(null);

    startTransition(async () => {
      try {
        const prediction = await predictPestAttack({ cropType, location, weatherData, historicalPestData });
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
          <CardTitle className="font-headline">Predict Pest Attacks</CardTitle>
          <CardDescription>
            Fill in the details to get an AI-powered pest attack prediction and preventive measures.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Input id="cropType" name="cropType" placeholder="e.g., Wheat, Corn, Tomato" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Farm Location</Label>
              <Input id="location" name="location" placeholder="e.g.,Eluru" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weatherData">Current Weather Data</Label>
              <Textarea id="weatherData" name="weatherData" placeholder="e.g., Temp: 30°C, Humidity: 75%, Recent heavy rains" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="historicalPestData">Historical Pest Data</Label>
              <Textarea id="historicalPestData" name="historicalPestData" placeholder="e.g., Last year saw an outbreak of aphids in this season." required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Predicting...' : 'Predict Pest Attack'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Prediction Results</CardTitle>
          <CardDescription>
            AI-generated analysis and recommendations will appear here.
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
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-24 w-full" />
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
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Siren className="h-5 w-5 text-destructive" /> Pest Risk Level</h3>
                <p className={`text-2xl font-bold ${result.pestRiskLevel.toLowerCase() === 'high' ? 'text-destructive' : result.pestRiskLevel.toLowerCase() === 'medium' ? 'text-yellow-600' : 'text-primary'}`}>
                  {result.pestRiskLevel}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Bug className="h-5 w-5 text-muted-foreground" /> Predicted Pest Types</h3>
                <div className="flex flex-wrap gap-2">
                  {result.pestTypes.map((pest, index) => (
                    <div key={index} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                      {pest}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Preventive Measures</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.preventiveMeasures}</p>
              </div>
            </div>
          )}
          {!isPending && !result && !error && (
            <div className="text-center text-muted-foreground py-12">
              <p>Your pest prediction report is awaiting data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
