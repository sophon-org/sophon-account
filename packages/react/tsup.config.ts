import { defineConfig } from "tsup";

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
    splitting: false,
    sourcemap: !!options.watch,
    clean: true,
    minify: !options.watch,
    external: ["react"],
    treeshake: true,
    dts: true,
    format: ["esm", "cjs"],
    outDir: "dist",
  };
});
