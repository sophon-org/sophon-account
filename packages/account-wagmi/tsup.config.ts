import { fixImportsPlugin } from "esbuild-fix-imports-plugin";
import { defineConfig } from "tsup";
import path from "path";

export default defineConfig((options) => {
  return {
    entry: ["src/*", "src/hooks/*", "src/components/*"],
    splitting: true,
    sourcemap: !!options.watch,
    clean: true,
    bundle: false,
    minify: !options.watch,
    external: ["react", "wagmi"],
    treeshake: true,
    dts: true,
    format: ["esm", "cjs"],
    outDir: "dist",
    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
    esbuildPlugins: [fixImportsPlugin()],
    // banner: {
    //   js: `"use client";`,
    // },
    // esbuildOptions(options) {
    //   options.banner = {
    //     js: '"use client"',
    //   };
    // },
  };
});
