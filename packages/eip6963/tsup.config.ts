import { defineConfig } from "tsup";
import path from "path";

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts", "src/mainnet.ts", "src/testnet.ts"],
    splitting: false,
    sourcemap: !!options.watch,
    clean: true,
    minify: !options.watch,
    dts: true,
    format: ["esm", "cjs"],
    outDir: "dist",
    tsconfig: path.resolve(__dirname, "./tsconfig.json"),
  };
});
