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

export interface MapData {
  width: number;       // Width in pixels
  height: number;      // Height in grids (rows)
  gridWidthCount: number; // Width in grids (cols)
  tileSize: number;
  // Visual representation for the editor (combines layers)
  // We use a flat representation for the editor state to make rendering easier,
  // then convert to the specific JSON format on export.
  // 0 = empty. String = tool ID.
  grid: (string | null)[][]; 
}

export interface ExportedMapJson {
  width: number;
  height: number;
  tileSize: number;
  tiles: string[][]; // The background matrix
  objects: MapObject[]; // The dynamic entities
}
