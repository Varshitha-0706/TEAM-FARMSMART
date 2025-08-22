"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Droplets, Sun, Wind } from "lucide-react";

type Advisory = {
  title: string;
  description: string;
  category: "Weather" | "Soil" | "Crop";
};

const advisoryData: Advisory[] = [
  {
    title: "Heavy Rainfall Expected",
    description: "Anticipate 2-3 inches of rain in the next 48 hours. Ensure proper drainage to prevent waterlogging for your corn crop.",
    category: "Weather",
  },
  {
    title: "Nitrogen Levels Low",
    description: "Your recent soil sample indicates low nitrogen. Consider applying a nitrogen-rich fertilizer before the next growth stage.",
    category: "Soil",
  },
  {
    title: "Optimal Planting Window",
    description: "The upcoming week's soil temperature and moisture levels are ideal for planting soybeans. Aim to complete planting by Friday.",
    category: "Crop",
  },
   {
    title: "High Winds Forecasted",
    description: "Strong winds of up to 25 mph are expected tomorrow. Young or tall crops may need support. Check irrigation equipment for stability.",
    category: "Weather",
  },
];

const getCategoryIcon = (category: Advisory['category']) => {
  switch (category) {
    case "Weather":
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case "Soil":
      return <Droplets className="h-6 w-6 text-orange-700" />;
    case "Crop":
      return <LeafIcon className="h-6 w-6 text-primary" />;
    default:
      return null;
  }
};


export default function GeoAdvisoryCard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><MapPin/> Location-Based Advisory</CardTitle>
          <CardDescription>
            Personalized recommendations for your farm at <span className="font-semibold text-foreground">Sunnyvale Fields, CA</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {advisoryData.map((item, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                    <div className="p-2 bg-muted rounded-md">
                        {getCategoryIcon(item.category)}
                    </div>
                    <CardTitle className="text-base font-medium font-body">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle className="text-lg font-headline">Current Conditions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Sun className="h-8 w-8 text-yellow-500" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Temperature</p>
              <p className="text-2xl font-bold">75°F</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Humidity</p>
              <p className="text-2xl font-bold">62%</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Wind className="h-8 w-8 text-gray-500" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Wind</p>
              <p className="text-2xl font-bold">8 mph</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function LeafIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z" />
      <path d="M12 4c1.5 2.5 3 4.5 3 6 0 1.5-1.5 3-3 3s-3-1.5-3-3c0-1.5 1.5-3.5 3-6Z" />
    </svg>
  );
}
