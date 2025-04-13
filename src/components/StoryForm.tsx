
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface StoryFormProps {
  onSubmit: (description: string, panelCount: number) => void;
  isLoading: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [panelCount, setPanelCount] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description, panelCount);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-none bg-white">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-2">
            Story Description
          </label>
          <Textarea
            id="story"
            placeholder="Describe your story in detail. For example: A young explorer discovers an ancient temple hidden in a dense jungle. As they step inside, they find a glowing artifact..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32 resize-y"
            required
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="panelCount" className="block text-sm font-medium text-gray-700">
              Number of Panels
            </label>
            <span className="text-sm font-medium bg-panelize-light-purple text-panelize-dark-purple px-2 py-1 rounded-full">
              {panelCount} {panelCount === 1 ? 'panel' : 'panels'}
            </span>
          </div>
          <Slider
            id="panelCount"
            min={1}
            max={10}
            step={1}
            value={[panelCount]}
            onValueChange={(values) => setPanelCount(values[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-panelize-dark-purple to-panelize-purple hover:opacity-90 transition-opacity"
          disabled={isLoading || !description.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Panels...
            </>
          ) : (
            'Generate Story Panels'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default StoryForm;
