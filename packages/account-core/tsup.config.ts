import { defineConfig } from "tsup";
import path from "path";

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts", "src/wallet.ts", "src/config.ts"],
    splitting: true,
    sourcemap: !!options.watch,
    clean: true,
    bundle: false,
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
