import { defineConfig } from "tsup";
import path from "path";

export default defineConfig((options) => ({
  entry: [
    "src/index.ts",
    "src/Button.tsx",
    "src/InfoCard.tsx",
    "src/BlueLink.tsx",
    "src/SendTransactionModal.tsx",
    "src/SignMessageModal.tsx",
    "src/TextHighlight.tsx",
    "src/Background.tsx",
  ],
  splitting: true,
  bundle: false,
  sourcemap: !!options.watch,
  clean: true,
  minify: !options.watch,
  external: ["react"],
  treeshake: true,
  dts: true,
  format: ["esm", "cjs"],
  outDir: "dist",
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
}));
