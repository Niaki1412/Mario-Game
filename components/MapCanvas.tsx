
import React, { useState, useRef, useEffect } from 'react';
import { MapData, EditorTool, GridCell } from '../types';
import { TOOLS, TILE_SIZE_DEFAULT } from '../constants';

interface MapCanvasProps {
  mapData: MapData;
  selectedTool: EditorTool;
  onUpdateCell: (row: number, col: number, toolId: string | null) => void;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ mapData, selectedTool, onUpdateCell }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<'paint' | 'erase'>('paint');
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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
    const mode = e.button === 2 ? 'erase' : 'paint';
    setDrawMode(mode);

    if (mode === 'erase') {
      onUpdateCell(row, col, null);
    } else {
      // If the selected tool is explicitly the eraser tool
      if (selectedTool.id === 'eraser') {
        onUpdateCell(row, col, 'eraser');
      } else {
        onUpdateCell(row, col, selectedTool.id);
      }
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDrawing) return;
    if (drawMode === 'erase' || selectedTool.id === 'eraser') {
      onUpdateCell(row, col, 'eraser');
    } else {
      onUpdateCell(row, col, selectedTool.id);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const renderCellContent = (cell: GridCell) => {
    let terrainNode = null;
    if (cell.terrainId && cell.terrainId !== '0') {
      const tool = TOOLS.find(t => t.id === cell.terrainId);
      if (tool) {
        // Special visual for death block to make it visible in editor but semi-transparent
        const opacity = tool.id === 'death_block' ? 'opacity-70' : 'opacity-100';
        terrainNode = (
          <div className={`absolute inset-0 flex items-center justify-center text-lg shadow-sm ${tool.color} ${opacity} transition-opacity hover:opacity-90`}>
            {tool.icon}
          </div>
        );
      }
    }

    let entityNode = null;
    if (cell.entityId) {
      const tool = TOOLS.find(t => t.id === cell.entityId);
      if (tool) {
        entityNode = (
           <div className={`absolute inset-0 flex items-center justify-center z-10`}>
             <div className={`w-3/4 h-3/4 flex items-center justify-center rounded-full shadow-md ${tool.color} border border-white/40 hover:scale-110 transition-transform`}>
                <span className="text-xs drop-shadow-md">{tool.icon}</span>
             </div>
           </div>
        );
      }
    }

    return (
      <>
        {terrainNode}
        {entityNode}
      </>
    );
  };

  const gridStyle = {
    backgroundSize: `${TILE_SIZE_DEFAULT}px ${TILE_SIZE_DEFAULT}px`,
    backgroundImage: `
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
    `,
  };

  return (
    // Main container handles scrolling. 
    // overflow-x-auto allows Left/Right movement.
    // overflow-y-auto allows Up/Down if screen is too small, but we try to keep it fixed if possible.
    <div 
      className="flex-1 bg-gray-100 overflow-x-auto overflow-y-auto relative custom-scrollbar flex flex-col"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex-1 flex items-start justify-start p-12 min-w-max">
        <div 
          ref={canvasContainerRef}
          className="bg-white shadow-2xl relative select-none border border-gray-300"
          style={{
            width: mapData.gridWidthCount * TILE_SIZE_DEFAULT,
            height: mapData.height * TILE_SIZE_DEFAULT,
            ...gridStyle
          }}
        >
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${mapData.gridWidthCount}, ${TILE_SIZE_DEFAULT}px)`,
              gridTemplateRows: `repeat(${mapData.height}, ${TILE_SIZE_DEFAULT}px)`,
            }}
          >
            {mapData.grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-full h-full relative hover:bg-blue-500/10 transition-colors duration-75"
                  onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                >
                  {renderCellContent(cell)}
                </div>
              ))
            ))}
          </div>

          {/* Top Ruler */}
          <div className="absolute -top-6 left-0 right-0 h-6 flex items-end border-b border-gray-300 pointer-events-none">
             {Array.from({ length: Math.ceil(mapData.gridWidthCount / 5) }).map((_, i) => (
               <div key={i} className="absolute text-[10px] text-gray-400 font-mono" style={{ left: i * 5 * TILE_SIZE_DEFAULT }}>
                 | {i * 5}
               </div>
             ))}
          </div>

          {/* Left Ruler */}
          <div className="absolute top-0 -left-8 bottom-0 w-8 flex flex-col items-end pr-1 pointer-events-none">
             {Array.from({ length: mapData.height }).map((_, i) => (
                (i % 5 === 0) ? (
                  <div key={i} className="absolute text-[10px] text-gray-400 font-mono" style={{ top: i * TILE_SIZE_DEFAULT }}>
                    {i} -
                  </div>
                ) : null
             ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MapCanvas;
