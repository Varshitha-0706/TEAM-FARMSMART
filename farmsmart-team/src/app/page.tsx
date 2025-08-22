"use client";

import * as React from "react";
import {
  Leaf,
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

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
};

const navItems: NavItem[] = [
  { id: 'pest', label: 'Pest Prediction', icon: Leaf, component: PestPredictionCard },
  { id: 'yield', label: 'Yield Forecast', icon: AreaChart, component: YieldForecastCard },
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
  );
}
