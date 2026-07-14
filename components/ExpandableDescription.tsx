'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableDescriptionProps {
  summary: string;
  fullText: string;
}

export default function ExpandableDescription({ summary, fullText }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-2 sm:mt-4 max-w-2xl">
      <div 
        className="font-body text-slate-300 pl-1 text-sm sm:text-lg leading-relaxed drop-shadow-md italic cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <div className="flex items-end gap-2 transition-opacity duration-300">
            <span>{summary}</span>
            <span className="flex items-center text-pink-500 text-sm font-semibold tracking-wider uppercase whitespace-nowrap ml-2 group-hover:text-cyan-400 transition-colors">
              Mais <ChevronDown className="w-4 h-4 ml-0.5" />
            </span>
          </div>
        ) : (
          <div className="transition-opacity duration-300">
            <div dangerouslySetInnerHTML={{ __html: fullText }} className="space-y-4" />
            <div className="flex items-center text-pink-500 text-sm font-semibold tracking-wider uppercase mt-2 group-hover:text-cyan-400 transition-colors">
              Ocultar <ChevronDown className="w-4 h-4 ml-0.5 rotate-180 transition-transform" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
