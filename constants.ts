import { EditorTool, ItemCategory } from "./types";
import { ELEMENT_CONFIG } from "./gameConfig";

// This file maps the internal game configuration to the Editor UI Tools

export const TILE_SIZE_DEFAULT = 32;
export const GRID_HEIGHT_DEFAULT = 15; // 15 blocks high
export const GRID_WIDTH_DEFAULT = 100; // 100 blocks wide default

export const TOOLS: EditorTool[] = [
  {
    id: "eraser",
    name: "Eraser",
    category: ItemCategory.TERRAIN, // Acts as removing terrain/objects
    color: "bg-gray-100 border-dashed border-2 border-gray-400",
    icon: "🧼",
    description: "Remove items",
    jsonValue: "0"
  },
  // Terrain Tools
  {
    id: "ground",
    name: ELEMENT_CONFIG.tiles.ground.name,
    category: ItemCategory.TERRAIN,
    color: "bg-amber-700",
    icon: "🧱",
    description: "Solid ground",
    jsonValue: ELEMENT_CONFIG.tiles.ground.id
  },
  {
    id: "brick",
    name: ELEMENT_CONFIG.tiles.brick.name,
    category: ItemCategory.TERRAIN,
    color: "bg-orange-600",
    icon: "🧱",
    description: "Destructible brick",
    jsonValue: ELEMENT_CONFIG.tiles.brick.id
  },
  {
    id: "hard_block",
    name: ELEMENT_CONFIG.tiles.hardBlock.name,
    category: ItemCategory.TERRAIN,
    color: "bg-stone-600",
    icon: "🔲",
    description: "Indestructible block",
    jsonValue: ELEMENT_CONFIG.tiles.hardBlock.id
  },
  // Entity Tools
  {
    id: "coin",
    name: ELEMENT_CONFIG.entities.coin.name,
    category: ItemCategory.ENTITY,
    color: "bg-yellow-400 rounded-full scale-75",
    icon: "🪙",
    description: "Collect for points",
    objectType: ELEMENT_CONFIG.entities.coin.type
  },
  {
    id: "mushroom",
    name: ELEMENT_CONFIG.entities.mushroom.name,
    category: ItemCategory.ENTITY,
    color: "bg-red-500 rounded-t-lg",
    icon: "🍄",
    description: "Power up",
    objectType: ELEMENT_CONFIG.entities.mushroom.type
  },
  {
    id: "goomba",
    name: ELEMENT_CONFIG.entities.goomba.name,
    category: ItemCategory.ENTITY,
    color: "bg-orange-800 rounded-t-xl",
    icon: "👾",
    description: "Basic enemy",
    objectType: ELEMENT_CONFIG.entities.goomba.type
  },
  {
    id: "koopa",
    name: ELEMENT_CONFIG.entities.koopa.name,
    category: ItemCategory.ENTITY,
    color: "bg-green-600 rounded-t-xl",
    icon: "🐢",
    description: "Shell enemy",
    objectType: ELEMENT_CONFIG.entities.koopa.type
  },
];
