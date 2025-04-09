import { Title, Image, ImageProps, Anchor, Text } from "@mantine/core";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <Title order={1}>{children}</Title>,
    h2: ({ children }) => <Title order={2}>{children}</Title>,
    h3: ({ children }) => <Title order={3}>{children}</Title>,
    h4: ({ children }) => <Title order={4}>{children}</Title>,
    h5: ({ children }) => <Title order={5}>{children}</Title>,
    h6: ({ children }) => <Title order={6}>{children}</Title>,
    img: (props) => <Image {...(props as ImageProps)} />,
    a: ({ children, href }) => <Anchor href={href}>{children}</Anchor>,
    p: ({ children }) => <Text>{children}</Text>,
    ...components,
  };
}
