"use client";

import * as React from "react";
import { useTransition } from "react";
import { voiceAssistant } from "@/ai/flows/voice-assistant";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Bot, Mic, Volume2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";

export default function VoiceAssistantCard() {
  const [isPending, startTransition] = useTransition();
  const [audioSrc, setAudioSrc] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [audioSrc]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    setAudioSrc(null);
    setError(null);

    startTransition(async () => {
      try {
        const result = await voiceAssistant({ query });
        setAudioSrc(result.audio);
      } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
      }
    });
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">AI Voice Assistant</CardTitle>
        <CardDescription>
          Ask a question in your local language and get a spoken response from our AI assistant.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Your Question</Label>
            <div className="relative">
              <Textarea
                id="query"
                name="query"
                placeholder="e.g., What is the best fertilizer for rice in wet season?"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-12"
              />
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" type="button" aria-label="Use Microphone (UI Only)">
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="pt-4">
             {isPending && (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-primary/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-primary/20" />
                    <Skeleton className="h-4 w-[200px] bg-primary/20" />
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

              {audioSrc && (
                <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-primary/10 p-6">
                  <Volume2 className="h-10 w-10 text-primary animate-pulse" />
                  <p className="text-sm font-medium text-primary">Playing audio response...</p>
                  <audio ref={audioRef} src={audioSrc} controls className="w-full" />
                </div>
              )}

              {!isPending && !audioSrc && !error && (
                <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-4">
                  <Bot size={48} className="text-primary/50" />
                  <p>The assistant is ready to help.</p>
                </div>
              )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending || !query.trim()}>
            {isPending ? 'Generating...' : 'Ask Assistant'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
