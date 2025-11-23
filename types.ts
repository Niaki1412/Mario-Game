
// Defines the fundamental types for the Map and Editor

export enum ItemCategory {
  TERRAIN = 'terrain', // Goes into the 'tiles' matrix
  ENTITY = 'entity',   // Goes into the 'objects' list
}

export interface EditorTool {
  id: string;
  name: string;
  category: ItemCategory;
  color: string;
  icon: string; // Using text/emoji as icon for simplicity
  description: string;
  // Specific data that goes into the JSON output
  jsonValue?: string; // For terrain (e.g., "1")
  objectType?: string; // For entities (e.g., "goomba")
}

export interface MapObject {
  type: string;
  x: number;
  y: number;
  variant?: string;
}

// Represents a single cell in the grid, capable of holding both terrain and an entity
export interface GridCell {
  terrainId: string | null;
  entityId: string | null;
}

export interface MapData {
  width: number;       // Width in pixels
  height: number;      // Height in grids (rows)
  gridWidthCount: number; // Width in grids (cols)
  tileSize: number;
  // Visual representation for the editor (combines layers)
  // grid[row][col]
  grid: GridCell[][]; 
}

export interface ExportedMapJson {
  width: number;
  height: number;
  tileSize: number;
  tiles: string[][]; // The background matrix
  objects: MapObject[]; // The dynamic entities
}
