import React, { useState, useCallback } from 'react';
import EditorSidebar from './components/EditorSidebar';
import PropertiesPanel from './components/PropertiesPanel';
import MapCanvas from './components/MapCanvas';
import { EditorTool, MapData, ItemCategory, ExportedMapJson, MapObject } from './types';
import { TOOLS, GRID_HEIGHT_DEFAULT, GRID_WIDTH_DEFAULT, TILE_SIZE_DEFAULT } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [selectedTool, setSelectedTool] = useState<EditorTool>(TOOLS[1]); // Default to Ground

  // Map Data State
  const [mapData, setMapData] = useState<MapData>(() => {
    // Initialize empty grid
    const grid = Array(GRID_HEIGHT_DEFAULT).fill(null).map(() => Array(GRID_WIDTH_DEFAULT).fill(null));
    return {
      width: GRID_WIDTH_DEFAULT * TILE_SIZE_DEFAULT,
      height: GRID_HEIGHT_DEFAULT,
      gridWidthCount: GRID_WIDTH_DEFAULT,
      tileSize: TILE_SIZE_DEFAULT,
      grid: grid
    };
  });

  // --- Handlers ---

  const handleSelectTool = (tool: EditorTool) => {
    setSelectedTool(tool);
  };

  const handleUpdateCell = useCallback((row: number, col: number, toolId: string | null) => {
    setMapData(prev => {
      const newGrid = [...prev.grid]; // Shallow copy of rows
      newGrid[row] = [...prev.grid[row]]; // Shallow copy of the specific row
      newGrid[row][col] = toolId;
      return { ...prev, grid: newGrid };
    });
  }, []);

  const handleUpdateSize = (newCols: number, newRows: number) => {
    setMapData(prev => {
      // Create new grid with new dimensions, preserving existing data where possible
      const newGrid = Array(newRows).fill(null).map((_, rIndex) => 
        Array(newCols).fill(null).map((_, cIndex) => {
          if (rIndex < prev.grid.length && cIndex < prev.grid[0].length) {
            return prev.grid[rIndex][cIndex];
          }
          return null;
        })
      );

      return {
        ...prev,
        gridWidthCount: newCols,
        height: newRows,
        width: newCols * TILE_SIZE_DEFAULT,
        grid: newGrid
      };
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to clear the map?")) {
       const grid = Array(mapData.height).fill(null).map(() => Array(mapData.gridWidthCount).fill(null));
       setMapData(prev => ({ ...prev, grid }));
    }
  };

  const handleExport = () => {
    // 1. Convert grid to "tiles" matrix (string[][])
    // 2. Extract "objects" list
    
    const tiles: string[][] = [];
    const objects: MapObject[] = [];

    for (let r = 0; r < mapData.height; r++) {
      const rowStrings: string[] = [];
      for (let c = 0; c < mapData.gridWidthCount; c++) {
        const cellId = mapData.grid[r][c];
        
        if (!cellId) {
          rowStrings.push("0");
          continue;
        }

        const tool = TOOLS.find(t => t.id === cellId);
        if (!tool) {
          rowStrings.push("0");
          continue;
        }

        if (tool.category === ItemCategory.TERRAIN) {
          // It's a tile
          rowStrings.push(tool.jsonValue || "0");
        } else {
          // It's an entity, so the tile behind it is empty (or we assume empty for now)
          // Ideally, we might want to allow placing entities ON TOP of tiles, but for this simplified model
          // an entity occupies the cell. The tile map will see "0" here.
          rowStrings.push("0"); 
          
          if (tool.category === ItemCategory.ENTITY && tool.objectType) {
            objects.push({
              type: tool.objectType,
              x: c * mapData.tileSize, // Coordinate in pixels
              y: r * mapData.tileSize, // Coordinate in pixels
              // Add specific properties if needed (e.g., variant)
            });
          }
        }
      }
      tiles.push(rowStrings);
    }

    const exportData: ExportedMapJson = {
      width: mapData.width,
      height: mapData.height,
      tileSize: mapData.tileSize,
      tiles: tiles,
      objects: objects
    };

    // Trigger download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "level_map.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden font-sans text-gray-800">
      
      {/* Left Sidebar: Tools */}
      <EditorSidebar 
        selectedToolId={selectedTool.id} 
        onSelectTool={handleSelectTool} 
      />

      {/* Main Area: Canvas */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header / Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm z-20">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600">
            Mario Map Editor
          </h1>
          <div className="ml-8 flex items-center space-x-4 text-sm text-gray-500">
             <div className="flex items-center">
               <span className="w-3 h-3 bg-gray-200 border border-gray-300 mr-2"></span>
               Empty
             </div>
             <div className="flex items-center">
               <span className="w-3 h-3 bg-amber-700 mr-2"></span>
               Ground
             </div>
             <div className="flex items-center">
               <span className="w-3 h-3 bg-red-500 rounded-t mr-2"></span>
               Entity
             </div>
          </div>
        </header>

        {/* The Grid Canvas */}
        <MapCanvas 
          mapData={mapData} 
          selectedTool={selectedTool} 
          onUpdateCell={handleUpdateCell} 
        />
      </div>

      {/* Right Sidebar: Properties */}
      <PropertiesPanel 
        gridWidth={mapData.gridWidthCount}
        gridHeight={mapData.height}
        onUpdateSize={handleUpdateSize}
        onExport={handleExport}
        onReset={handleReset}
      />
      
    </div>
  );
};

export default App;
