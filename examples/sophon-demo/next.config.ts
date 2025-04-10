import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
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
