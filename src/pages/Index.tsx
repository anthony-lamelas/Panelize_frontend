
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
    
    try {
      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        // Mock response data
        const mockPanels: Panel[] = Array.from({ length: panelCount }, (_, i) => ({
          id: `panel-${i}`,
          imageBase64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVERUZGIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZFNTlBNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UGFuZWwgJHtpKzF9PC90ZXh0Pjwvc3ZnPg==',
          description: `Panel ${i+1} (${style}): ${description.substring(0, 25)}${description.length > 25 ? '...' : ''}`
        }));
        
        setPanels(mockPanels);
        setIsLoading(false);
        
        toast({
          title: "Panels generated",
          description: `Successfully created ${panelCount} panels in ${style} style for your story.`,
        });
      }, 2000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate panels. Please try again.",
        variant: "destructive",
      });
    }
  };

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
