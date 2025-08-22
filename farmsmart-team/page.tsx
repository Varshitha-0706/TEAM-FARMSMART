<<<<<<< HEAD

"use client";

import { useState, useEffect } from "react";
import type { Farmer, AnalysisResult } from "@/types";
import { RegistrationForm } from "@/components/dashboard/registration-form";
import { Header } from "@/components/dashboard/header";
import { CropAnalysis } from "@/components/dashboard/crop-analysis";
import { AnalysisHistory } from "@/components/dashboard/analysis-history";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { WeatherUpdates } from "@/components/dashboard/weather-updates";
import { MarketWatch } from "@/components/dashboard/market-watch";
import { FieldLayout } from "@/components/dashboard/field-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedFarmer = localStorage.getItem("farmer-details");
      const storedHistory = localStorage.getItem("analysis-history");
      if (storedFarmer) {
        setFarmer(JSON.parse(storedFarmer));
      }
      if (storedHistory) {
        // When retrieving from localStorage, dates are strings, so we need to convert them back to Date objects.
        const parsedHistory = JSON.parse(storedHistory).map(
          (item: AnalysisResult) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })
        );
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegister = (data: Farmer) => {
    setFarmer(data);
    localStorage.setItem("farmer-details", JSON.stringify(data));
  };

  const handleNewAnalysis = (result: AnalysisResult) => {
    const updatedHistory = [result, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("analysis-history", JSON.stringify(updatedHistory));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Skeleton className="h-16 w-full" />
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-4xl space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <RegistrationForm onRegister={handleRegister} />
      </main>
    );
  }

  return (
    <>
      <Header farmerName={farmer.name} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CropAnalysis onNewAnalysis={handleNewAnalysis} />
            <AnalysisHistory history={history} />
          </div>
          <div className="space-y-6">
            <HealthSummary history={history} />
            <FieldLayout history={history} />
            <WeatherUpdates district={farmer.district} />
            <MarketWatch cropType={farmer.cropType} />
          </div>
        </div>
      </main>
    </>
=======
"use client";

import * as React from "react";
import {
  Leaf,
  LineChart,
  Bot,
  MapPin,
  Camera,
  AreaChart,
  type LucideIcon,
  PanelLeft,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PestPredictionCard from "@/components/feature-cards/pest-prediction";
import YieldForecastCard from "@/components/feature-cards/yield-forecast";
import VoiceAssistantCard from "@/components/feature-cards/voice-assistant";
import GeoAdvisoryCard from "@/components/feature-cards/geo-advisory";
import ImageRecognitionCard from "@/components/feature-cards/image-recognition";
import MarketTrendsCard from "@/components/feature-cards/market-trends";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
};

const navItems: NavItem[] = [
  { id: 'pest', label: 'Pest Prediction', icon: Leaf, component: PestPredictionCard },
  { id: 'yield', label: 'Yield Forecast', icon: AreaChart, component: YieldForecastCard },
  { id: 'market', label: 'Market Trends', icon: LineChart, component: MarketTrendsCard },
  { id: 'assistant', label: 'Voice Assistant', icon: Bot, component: VoiceAssistantCard },
  { id: 'recognition', label: 'Image Recognition', icon: Camera, component: ImageRecognitionCard },
  { id: 'advisory', label: 'Geo Advisory', icon: MapPin, component: GeoAdvisoryCard },
];

export default function FarmSmartDashboard() {
  const [activeView, setActiveView] = React.useState<string>('pest');

  const ActiveComponent = navItems.find(item => item.id === activeView)?.component || PestPredictionCard;
  const activeLabel = navItems.find(item => item.id === activeView)?.label || 'Dashboard';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-headline font-bold text-sidebar-foreground">FARMSMART</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveView(item.id)}
                  isActive={activeView === item.id}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start gap-2 w-full px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="farmer portrait" />
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                  <span className="truncate">Farm Owner</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Farm Owner</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      owner@farmsmart.io
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden"/>
          <h1 className="flex-1 text-xl font-headline font-semibold">{activeLabel}</h1>
          <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"/>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background/50">
          <ActiveComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
>>>>>>> a839c04 (Initial prototype)
  );
}
