
import React, { useRef } from 'react';

interface PropertiesPanelProps {
  gridWidth: number;
  gridHeight: number;
  onUpdateSize: (width: number, height: number) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  gridWidth, 
  gridHeight, 
  onUpdateSize,
  onExport,
  onImport,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-10">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-gray-700 text-lg">Scene Properties</h2>
        <p className="text-xs text-gray-500">Configure map dimensions</p>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        
        {/* Dimensions Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Map Dimensions</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Width (blocks)
            </label>
            <input 
              type="number" 
              min="20" 
              max="2000"
              value={gridWidth}
              onChange={(e) => onUpdateSize(parseInt(e.target.value) || 20, gridHeight)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500">Length of the level (Default: 640)</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Height (blocks)
            </label>
            <input 
              type="number" 
              min="10" 
              max="100"
              value={gridHeight}
              onChange={(e) => onUpdateSize(gridWidth, parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500">Vertical height (Default: 32)</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">File Actions</h3>
          
          <button 
            onClick={onExport}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export JSON
          </button>

           <button 
            onClick={triggerFileInput}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            Import JSON
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onImport} 
            accept=".json" 
            className="hidden"
          />

          <button 
            onClick={onReset}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear Map
          </button>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
          <p className="font-semibold mb-1">Tips:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Scene moves horizontally.</li>
            <li>You can stack entities (Coins, Mushrooms) on top of tiles (Ground, Bricks).</li>
            <li>Export saves to <code>/maps</code> structure format.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
