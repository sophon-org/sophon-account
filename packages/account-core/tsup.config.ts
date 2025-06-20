import { fixImportsPlugin } from "esbuild-fix-imports-plugin";
import { defineConfig } from "tsup";
import path from "path";

export default defineConfig((options) => {
  return {
    entry: [
      "src/abis/*",
      "src/index.ts",
      "src/wallet.ts",
      "src/config.ts",
      "src/snsHelper.ts",
      "src/siws.ts",
      "src/utils.ts",
      "src/sessionHelper.ts",
      "src/types/*",
    ],
    splitting: true,
    sourcemap: !!options.watch,
    clean: true,
    bundle: false,
    minify: !options.watch,
    dts: true,
    format: ["esm", "cjs"],
    outDir: "dist",
    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
    esbuildPlugins: [fixImportsPlugin()],
    // banner: {
    //   js: `"use client";`,
    // },
  };
});
