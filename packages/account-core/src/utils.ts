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
    throw new Error("Input string is required");
  }

  // Generate a hash from the input string
  const hash = hashString(inputString);

  // Use the hash to select two different colors from the palette
  let colorIndex1 = Math.abs(hash % COLOR_PALETTE_200.length);
  const colorIndex2 = Math.abs((hash >> 8) % COLOR_PALETTE_200.length);

  // Ensure the colors are different
  if (colorIndex1 === colorIndex2) {
    colorIndex1 = (colorIndex1 + 1) % COLOR_PALETTE_200.length;
  }

  const color1 = COLOR_PALETTE_200[colorIndex1];
  const color2 = COLOR_PALETTE_200[colorIndex2];

  // Generate an angle (0 to 2π), counterclockwise
  const angle = ((Math.abs(hash >> 16) % 1000) / 1000) * 2 * Math.PI; // Range: 0 to 2π

  // Generate a Vector2 with values between 0.2 and 0.8
  const centerX = ((Math.abs(hash >> 24) % 101) / 100) * 0.6 + 0.2; // Range: 0.2 to 0.8
  const centerY = ((Math.abs(hash >> 16) % 101) / 100) * 0.6 + 0.2; // Range: 0.2 to 0.8

  const colorText = COLOR_PALETTE_400[colorIndex1];

  return {
    color1,
    color2,
    colorText,
    angle: Number(angle.toFixed(3)),
    centerX: Number(centerX.toFixed(3)),
    centerY: Number(centerY.toFixed(3)),
  };
};

export const getSVGAvatarFromString = (inputString: string): string => {
  const params = generateParamsFromString(inputString);
  const { color1, color2, angle, centerX, centerY } = params;

  // Calculate the gradient end point based on the starting point and angle
  const gradientLength = 1; // Length of the gradient vector
  const x2 = centerX + Math.cos(angle) * gradientLength;
  const y2 = centerY + Math.sin(angle) * gradientLength;

  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="${centerX * 100}%" y1="${centerY * 100}%" x2="${x2 * 100}%" y2="${y2 * 100}%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#gradient)"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};
