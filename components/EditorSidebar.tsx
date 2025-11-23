import React from 'react';
import { TOOLS } from '../constants';
import { EditorTool } from '../types';

interface EditorSidebarProps {
  selectedToolId: string;
  onSelectTool: (tool: EditorTool) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ selectedToolId, onSelectTool }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-gray-700 text-lg">Toolbox</h2>
        <p className="text-xs text-gray-500">Select an element to paint</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {TOOLS.map((tool) => {
          const isSelected = selectedToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 border-2 text-left group
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 shadow-sm border border-black/10 ${tool.id === 'eraser' ? 'bg-white' : 'bg-gray-100'}`}>
                 {/* This renders the visual preview using the same classes we'll use on the grid */}
                 <div className={`w-8 h-8 flex items-center justify-center text-xl ${tool.color}`}>
                   {tool.icon}
                 </div>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{tool.name}</div>
                <div className="text-[10px] text-gray-500 leading-tight">{tool.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 text-center">
        Left Click to Paint<br/>Right Click to Erase
      </div>
    </div>
  );
};

export default EditorSidebar;
