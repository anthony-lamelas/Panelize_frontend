
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StoryFormProps {
  onSubmit: (description: string, panelCount: number, style: string) => void;
  isLoading: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [panelCount, setPanelCount] = useState(3);
  const [style, setStyle] = useState('comic book');
  const [customStyle, setCustomStyle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      const finalStyle = style === 'custom' ? customStyle : style;
      onSubmit(description, panelCount, finalStyle);
    }
  };

  const handlePanelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
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

        <div className="mb-6">
          <label htmlFor="panelCount" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Panels
          </label>
          <Input
            id="panelCount"
            type="number"
            min={1}
            value={panelCount}
            onChange={handlePanelCountChange}
            className="w-full"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Style
          </label>
          <RadioGroup 
            value={style} 
            onValueChange={setStyle}
            className="grid grid-cols-2 gap-2 md:grid-cols-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="manga" id="manga" />
              <Label htmlFor="manga" className="cursor-pointer">Manga</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="comic book" id="comic" />
              <Label htmlFor="comic" className="cursor-pointer">Comic Book</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="realistic" id="realistic" />
              <Label htmlFor="realistic" className="cursor-pointer">Realistic</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
            </div>
          </RadioGroup>
          
          {style === 'custom' && (
            <div className="mt-3">
              <Input
                placeholder="Enter custom style (e.g., watercolor, pixel art, etc.)"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="w-full"
                required={style === 'custom'}
              />
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-panelize-blue hover:opacity-90 transition-opacity"
          disabled={isLoading || !description.trim() || (style === 'custom' && !customStyle.trim())}
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
