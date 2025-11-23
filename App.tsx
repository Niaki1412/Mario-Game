
import React, { useState, useCallback } from 'react';
import EditorSidebar from './components/EditorSidebar';
import PropertiesPanel from './components/PropertiesPanel';
import MapCanvas from './components/MapCanvas';
import { EditorTool, MapData, ItemCategory, ExportedMapJson, MapObject, GridCell } from './types';
import { TOOLS, GRID_HEIGHT_DEFAULT, GRID_WIDTH_DEFAULT, TILE_SIZE_DEFAULT } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [selectedTool, setSelectedTool] = useState<EditorTool>(TOOLS[1]); // Default to Ground

  // Map Data State with support for layers
  const [mapData, setMapData] = useState<MapData>(() => {
    // Initialize grid with objects
    const grid = Array(GRID_HEIGHT_DEFAULT).fill(null).map(() => 
      Array(GRID_WIDTH_DEFAULT).fill(null).map(() => ({ terrainId: null, entityId: null }))
    );
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
      const newGrid = prev.grid.map(r => r.map(c => ({...c}))); // Deep copy grid for safety with objects
      const cell = newGrid[row][col];

      if (toolId === 'eraser' || toolId === null) {
        // Eraser clears EVERYTHING in that cell
        cell.terrainId = null;
        cell.entityId = null;
      } else {
        const tool = TOOLS.find(t => t.id === toolId);
        if (tool) {
          if (tool.category === ItemCategory.TERRAIN) {
             cell.terrainId = toolId;
          } else if (tool.category === ItemCategory.ENTITY) {
             cell.entityId = toolId;
          }
        }
      }

      return { ...prev, grid: newGrid };
    });
  }, []);

  const handleUpdateSize = (newCols: number, newRows: number) => {
    setMapData(prev => {
      // Create new grid with new dimensions, preserving existing data where possible
      const newGrid = Array(newRows).fill(null).map((_, rIndex) => 
        Array(newCols).fill(null).map((_, cIndex) => {
          if (rIndex < prev.grid.length && cIndex < prev.grid[0].length) {
            return { ...prev.grid[rIndex][cIndex] };
          }
          return { terrainId: null, entityId: null };
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
       const grid = Array(mapData.height).fill(null).map(() => 
         Array(mapData.gridWidthCount).fill(null).map(() => ({ terrainId: null, entityId: null }))
       );
       setMapData(prev => ({ ...prev, grid }));
    }
  };

  const handleExport = () => {
    const tiles: string[][] = [];
    const objects: MapObject[] = [];

    for (let r = 0; r < mapData.height; r++) {
      const rowStrings: string[] = [];
      for (let c = 0; c < mapData.gridWidthCount; c++) {
        const cell = mapData.grid[r][c];
        
        // 1. Process Terrain
        if (cell.terrainId) {
          const tool = TOOLS.find(t => t.id === cell.terrainId);
          if (tool && tool.jsonValue) {
            rowStrings.push(tool.jsonValue);
          } else {
            rowStrings.push("0");
          }
        } else {
          rowStrings.push("0");
        }

        // 2. Process Objects
        if (cell.entityId) {
          const tool = TOOLS.find(t => t.id === cell.entityId);
          if (tool && tool.objectType) {
             objects.push({
               type: tool.objectType,
               x: c * mapData.tileSize,
               y: r * mapData.tileSize,
               // Add specific properties if needed
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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as ExportedMapJson;
        
        // Basic Validation
        if (!json.tiles || !json.width || !json.height) {
          alert("Invalid JSON map format detected.");
          return;
        }

        const newRows = json.tiles.length;
        const newCols = json.tiles[0].length;
        
        // Reconstruct Grid
        const newGrid = Array(newRows).fill(null).map(() => 
            Array(newCols).fill(null).map(() => ({ terrainId: null, entityId: null } as GridCell))
        );

        // 1. Fill Terrain
        for (let r = 0; r < newRows; r++) {
          for (let c = 0; c < newCols; c++) {
             const tileVal = json.tiles[r][c];
             if (tileVal !== "0") {
                const terrainTool = TOOLS.find(t => t.category === ItemCategory.TERRAIN && t.jsonValue === tileVal);
                if (terrainTool) {
                   newGrid[r][c].terrainId = terrainTool.id;
                }
             }
          }
        }

        // 2. Fill Objects
        if (json.objects) {
           json.objects.forEach(obj => {
             // Convert pixel to grid coordinate
             const c = Math.floor(obj.x / json.tileSize);
             const r = Math.floor(obj.y / json.tileSize);
             
             if (r >= 0 && r < newRows && c >= 0 && c < newCols) {
               const entityTool = TOOLS.find(t => t.category === ItemCategory.ENTITY && t.objectType === obj.type);
               if (entityTool) {
                 newGrid[r][c].entityId = entityTool.id;
               }
             }
           });
        }

        setMapData({
          width: json.width,
          height: json.height,
          gridWidthCount: newCols,
          tileSize: json.tileSize,
          grid: newGrid
        });
        
        // Reset file input
        event.target.value = "";

      } catch (err) {
        console.error(err);
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
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
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm z-20 justify-between">
          <div className="flex items-center">
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-600 mr-4">
              Mario Map Editor
            </h1>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500 border border-gray-300">v1.0</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
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
               Entity (Layer 2)
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
        onImport={handleImport}
        onReset={handleReset}
      />
      
    </div>
  );
};

export default App;
