import React from 'react';
import { Card } from "@/components/ui/card";
import { Panel } from '@/types/panel';

interface StoryPanelsProps {
  panels: Panel[];
}

const StoryPanels: React.FC<StoryPanelsProps> = ({ panels }) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Story Panels</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map((panel, idx) => (
          <Card key={idx} className="overflow-hidden border-none shadow-lg">
            <div className="aspect-[4/3] bg-panelize-light-blue relative overflow-hidden">
              <img 
                src={panel.image_url} 
                alt={`Panel ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-white space-y-2">
              <p className="text-xs text-gray-500">Prompt:</p>
              <p className="text-sm text-gray-700 italic">{panel.prompt}</p>

              <p className="text-xs text-gray-500 pt-2">Caption:</p>
              <p className="text-sm text-gray-800">{panel.caption}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoryPanels;
