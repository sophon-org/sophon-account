import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  outputFileTracingIncludes: {
    // "/api/examples": ["./examples/**/*"],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm" as any, { strict: true, throwOnError: true }]],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
