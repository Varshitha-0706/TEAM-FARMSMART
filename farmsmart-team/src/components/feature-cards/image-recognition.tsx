"use client";

import * as React from "react";
import { useTransition } from "react";
import Image from "next/image";
import { imageRecognition, type ImageRecognitionOutput } from "@/ai/flows/image-recognition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, UploadCloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ImageRecognitionCard() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = React.useState<ImageRecognitionOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) {
      setError("Please select an image to analyze.");
      return;
    }
    
    setError(null);

    startTransition(async () => {
      try {
        const prediction = await imageRecognition({ photoDataUri: preview });
        setResult(prediction);

        const newChartConfig: ChartConfig = {};
        prediction.results.forEach((item, index) => {
          newChartConfig[item.label] = {
            label: item.label,
            color: COLORS[index % COLORS.length],
          };
        });
        setChartConfig(newChartConfig);

      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pest & Disease Recognition</CardTitle>
          <CardDescription>
            Upload a photo of a plant to detect potential issues using AI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant-photo">Plant Photo</Label>
              <Input id="plant-photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
              <div 
                className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                   <div className="relative w-full h-64">
                     <Image src={preview} alt="Plant preview" layout="fill" objectFit="contain" className="rounded-md" />
                   </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="h-10 w-10" />
                    <p>Click to upload or drag and drop</p>
                    <p className="text-xs">PNG, JPG, or WEBP</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analysis Report</CardTitle>
          <CardDescription>
            AI-generated identification and confidence levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
             <div className="flex justify-center items-center py-12">
                <Skeleton className="h-48 w-48 rounded-full" />
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
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[300px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={result.results}
                  dataKey="confidence"
                  nameKey="label"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {result.results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.label]?.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
          {!isPending && !result && !error && (
            <div className="text-center text-muted-foreground py-12">
              <p>Upload an image to get your analysis.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
