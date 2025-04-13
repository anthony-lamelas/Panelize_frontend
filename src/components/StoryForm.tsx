
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

  const handlePanelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setPanelCount(value);
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
          <label htmlFor="panelCount" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Panels (1-10)
          </label>
          <Input
            id="panelCount"
            type="number"
            min={1}
            max={10}
            value={panelCount}
            onChange={handlePanelCountChange}
            className="w-full"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-panelize-dark-blue to-panelize-blue hover:opacity-90 transition-opacity"
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
