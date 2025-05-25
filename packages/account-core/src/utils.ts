const COLOR_PALETTE_200 = [
  "#CCE4FF",
  "#FFFAB8",
  "#FFDAC2",
  "#FABEDE",
  "#CCB0F5",
];

const COLOR_PALETTE_400 = [
  "#122B5C",
  "#474309",
  "#5C2907",
  "#662548",
  "#341A5C",
];

type GradientParams = {
  color1: string;
  color2: string;
  colorText: string;
  angle: number;
  centerX: number;
  centerY: number;
};

/**
 * Hash function to convert a string to a number
 * @param {string} str - Input string
 * @param {number} seed - Optional seed for the hash
 * @returns {number} - A number derived from the string
 */
const hashString = (str: string, seed = 0): number => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * Generates parameters from an input string
 * @param {string} inputString - The input string
 * @returns {Object} - Object containing two colors, an angle, and a Vector2
 */
export const generateParamsFromString = (
  inputString: string,
): GradientParams => {
  if (!inputString || typeof inputString !== "string") {
    inputString = "default";
  }

  // Generate a hash from the input string
  const hash = hashString(inputString);

  // Use the hash to select two different colors from the palette
  const colorIndex1 = Math.abs(hash % COLOR_PALETTE_200.length);
  let colorIndex2 = Math.abs((hash >> 8) % COLOR_PALETTE_200.length);

  // Ensure the colors are different
  if (colorIndex1 === colorIndex2) {
    colorIndex2 = (colorIndex2 + 1) % COLOR_PALETTE_200.length;
  }

  const color1 = COLOR_PALETTE_200[colorIndex1];
  const color2 = COLOR_PALETTE_200[colorIndex2];

  // Generate an angle (Math.PI / something)
  // Use a value between 2 and 12 for the divisor
  const divisor = 2 + Math.abs((hash >> 16) % 11);
  const angle = Math.PI / divisor;

  // Generate a Vector2 with values between 0 and 1
  const centerX = Math.abs((hash >> 24) % 100) / 100; // Range: 0 to 1
  const centerY = Math.abs((hash >> 28) % 100) / 100; // Range: 0 to 1

  const colorText = COLOR_PALETTE_400[colorIndex1];

  return {
    color1,
    color2,
    colorText,
    angle,
    centerX,
    centerY,
  };
};

export const getSVGAvatarFromString = (inputString: string): string => {
  const params = generateParamsFromString(inputString);
  const { color1, color2, angle, centerX, centerY } = params;

  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="${centerX}" y1="${centerY}" x2="${Math.cos(angle)}" y2="${Math.sin(angle)}">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#gradient)"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};
