import React, { useState, useRef, useEffect } from 'react';
import { MapData, EditorTool } from '../types';
import { TOOLS, TILE_SIZE_DEFAULT } from '../constants';

interface MapCanvasProps {
  mapData: MapData;
  selectedTool: EditorTool;
  onUpdateCell: (row: number, col: number, toolId: string | null) => void;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ mapData, selectedTool, onUpdateCell }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  // Track if we are erasing (right click) or painting (left click)
  const [drawMode, setDrawMode] = useState<'paint' | 'erase'>('paint');
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Prevent context menu on right click to allow "Right Click Eraser"
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const currentRef = canvasContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('contextmenu', handleContextMenu);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, []);

  const handleMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    setIsDrawing(true);
    
    // Left click = paint, Right click = erase
    const mode = e.button === 2 ? 'erase' : 'paint';
    setDrawMode(mode);

    if (mode === 'erase') {
      onUpdateCell(row, col, null);
    } else {
      // If tool is eraser, it's also erasing
      if (selectedTool.id === 'eraser') {
        onUpdateCell(row, col, null);
      } else {
        onUpdateCell(row, col, selectedTool.id);
      }
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDrawing) return;

    if (drawMode === 'erase' || selectedTool.id === 'eraser') {
      onUpdateCell(row, col, null);
    } else {
      onUpdateCell(row, col, selectedTool.id);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Helper to render cell content
  const renderCellContent = (toolId: string | null) => {
    if (!toolId) return null;
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return null;

    return (
      <div className={`w-full h-full flex items-center justify-center text-lg shadow-sm ${tool.color} animate-fade-in`}>
        {tool.icon}
      </div>
    );
  };

  // Generate grid style for background
  const gridStyle = {
    backgroundSize: `${TILE_SIZE_DEFAULT}px ${TILE_SIZE_DEFAULT}px`,
    backgroundImage: `
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
    `,
  };

  return (
    <div 
      className="flex-1 bg-gray-200 overflow-x-auto overflow-y-hidden relative custom-scrollbar flex flex-col"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex-1 flex items-center justify-start p-8 min-w-max">
        {/* White Canvas Background */}
        <div 
          ref={canvasContainerRef}
          className="bg-white shadow-2xl relative select-none"
          style={{
            width: mapData.gridWidthCount * TILE_SIZE_DEFAULT,
            height: mapData.height * TILE_SIZE_DEFAULT,
            ...gridStyle
          }}
        >
          {/* We use a CSS grid for rendering cells to ensure pixel perfection */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${mapData.gridWidthCount}, ${TILE_SIZE_DEFAULT}px)`,
              gridTemplateRows: `repeat(${mapData.height}, ${TILE_SIZE_DEFAULT}px)`,
            }}
          >
            {mapData.grid.map((row, rowIndex) => (
              row.map((cellValue, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-full h-full hover:bg-blue-500/20 transition-colors duration-75 border-transparent border hover:border-blue-400 box-border"
                  onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                >
                  {renderCellContent(cellValue)}
                </div>
              ))
            ))}
          </div>

          {/* Grid Markers / Rulers */}
          <div className="absolute -top-6 left-0 flex text-xs text-gray-500 font-mono">
             <span>0</span>
             <span style={{ marginLeft: (TILE_SIZE_DEFAULT * 10) - 8 }}>10</span>
             <span style={{ marginLeft: (TILE_SIZE_DEFAULT * 10) - 16 }}>20</span>
          </div>
          
        </div>
      </div>

      {/* Info bar at bottom */}
      <div className="bg-white border-t border-gray-200 p-2 px-4 text-xs text-gray-500 flex justify-between">
         <span>Canvas Size: {mapData.gridWidthCount * TILE_SIZE_DEFAULT}px x {mapData.height * TILE_SIZE_DEFAULT}px</span>
         <span>Hold Right-Click to Erase</span>
      </div>
    </div>
  );
};

export default MapCanvas;
