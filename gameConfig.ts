
// This file defines the attributes for game characters and elements.
// It is separated from the logic as requested.

export const PLAYER_CONFIG = {
  height: 1, // in grid units
  jumpHeight: 4.5, // blocks
  moveSpeed: 5,
  forms: {
    small: {
      height: 1,
      canBreakBricks: false,
    },
    big: {
      height: 2,
      jumpHeightBonus: 0,
      canBreakBricks: true,
    },
    fire: {
      canShoot: true,
    }
  }
};

export const ELEMENT_CONFIG = {
  // Tile definitions
  tiles: {
    ground: {
      id: "1",
      name: "Ground",
      isSolid: true,
      destructible: false,
    },
    brick: {
      id: "2",
      name: "Brick",
      isSolid: true,
      destructible: true,
      breakScore: 50,
    },
    hardBlock: {
      id: "3",
      name: "Hard Block",
      isSolid: true,
      destructible: false,
    },
    deathBlock: {
      id: "4",
      name: "Invisible Death",
      isSolid: false, // or true depending on mechanic, usually pit-like behavior
      deadly: true,
      destructible: false,
    }
  },
  // Entity definitions
  entities: {
    goomba: {
      type: "goomba",
      name: "Goomba",
      score: 100,
      speed: 2,
      behavior: "patrol",
    },
    koopa: {
      type: "koopa",
      name: "Koopa",
      score: 200,
      speed: 3,
      behavior: "patrol_shell",
    },
    mushroom: {
      type: "mushroom",
      name: "Magic Mushroom",
      effect: "grow",
      speed: 2,
    },
    coin: {
      type: "coin",
      name: "Coin",
      score: 200,
      isSolid: false,
    }
  }
};
