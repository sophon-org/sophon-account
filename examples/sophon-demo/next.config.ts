import path from "node:path";
import createMDX from "@next/mdx";
import CopyPlugin from "copy-webpack-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              // copy the `examples` folder as-is
              from: "examples/",
              // it will be accessible at `.next/server/examples`
              to: path.resolve(__dirname, "public", "examples"),
            },
          ],
        })
      );
    }
    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-gfm" as any, { strict: true, throwOnError: true }],
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
