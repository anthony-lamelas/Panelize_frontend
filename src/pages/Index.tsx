
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import StoryForm from '@/components/StoryForm';
import StoryPanels from '@/components/StoryPanels';
import { Panel } from '@/types/panel';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [panels, setPanels] = useState<Panel[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (description: string, panelCount: number, style: string) => {
    setIsLoading(true);
    setPanels([]);
    
    try {
      const response = await fetch("/api/generate-panels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          story_description: description,
          num_panels: panelCount,
          style: style
        })
      });
      
      if (!response.ok) throw new Error("Request failed");
      
      const data = await response.json();
      setPanels(data.panels);
      setIsLoading(false);
      
      toast({
        title: "Panels generated",
        description: `Successfully created ${panelCount} panels in ${style} style.`,
      });
    
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate panels. Please try again.",
        variant: "destructive",
      });
    }
  }
    
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-panelize-soft-gray">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-panelize-blue via-blue-500 to-indigo-600 mb-4">
            Panelize
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Transform your story descriptions into beautiful visual panels. Just describe your story, 
            choose how many panels you want, and let our AI bring your narrative to life.
          </p>
        </header>

        <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />

        {panels.length > 0 && (
          <StoryPanels panels={panels} />
        )}

        {!panels.length && !isLoading && (
          <div className="mt-16 text-center text-gray-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-panelize-light-blue rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-panelize-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xl">Your story panels will appear here</p>
            <p className="mt-2 max-w-md mx-auto">
              Enter your story description and select the number of panels to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
