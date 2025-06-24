import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: [
      "src/index.ts",
      "src/mainnet.ts",
      "src/testnet.ts",
      "src/emitter.ts",
    ],
    splitting: true,
    sourcemap: !!options.watch,
    clean: true,
    minify: !options.watch,
    dts: true,
    format: ["esm", "cjs"],
    outDir: "dist",
    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
    // banner: {
    //   js: `"use client";`,
    // },
  };
});
