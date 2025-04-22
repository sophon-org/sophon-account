import { defineConfig } from "tsup";
import path from "path";

export default defineConfig((options) => {
  return {
    entry: [
      "src/index.ts",
      "src/provider.tsx",
      "src/chains.ts",
      "src/wagmi.tsx",
      "src/hooks/index.ts",
      "src/components/index.ts",
    ],
    splitting: true,
    bundle: true,
    sourcemap: !!options.watch,
    clean: true,
    minify: !options.watch,
    external: ["react"],
    treeshake: false,
    dts: true,
    format: ["esm", "cjs"],
    outDir: "dist",
    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
    banner: {
      js: `"use client";`,
    },
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"',
      };
    },
  };
});
