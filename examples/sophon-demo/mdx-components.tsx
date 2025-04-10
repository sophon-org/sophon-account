import { CodeHighlight, InlineCodeHighlight } from "@mantine/code-highlight";
import {
  Title,
  Image,
  ImageProps,
  Anchor,
  Text,
  Table,
  TableTr,
  TableTd,
  TableTh,
} from "@mantine/core";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <Title order={1} pt={20} pb={8}>
        {children}
      </Title>
    ),
    h2: ({ children }) => (
      <Title order={2} pt={20} pb={8}>
        {children}
      </Title>
    ),
    h3: ({ children }) => (
      <Title order={3} pt={20} pb={8}>
        {children}
      </Title>
    ),
    h4: ({ children }) => (
      <Title order={4} pt={20} pb={8}>
        {children}
      </Title>
    ),
    h5: ({ children }) => (
      <Title order={5} py={20}>
        {children}
      </Title>
    ),
    code: ({ children }) => {
      const lang = children.props?.className?.split("-")[1];
      return <InlineCodeHighlight language={lang} code={children} />;
    },
    pre: ({ children }) => {
      const lang = children.props?.className?.split("-")[1];
      return <CodeHighlight language={lang} code={children.props.children} />;
    },
    h6: ({ children }) => <Title order={6}>{children}</Title>,
    img: (props) => <Image {...(props as ImageProps)} />,
    a: ({ children, href }) => <Anchor href={href}>{children}</Anchor>,
    p: ({ children }) => <Text mb={20}>{children}</Text>,
    table: ({ children }) => (
      <Table highlightOnHover striped>
        {children}
      </Table>
    ),
    th: ({ children }) => <TableTh>{children}</TableTh>,
    td: ({ children }) => <TableTd>{children}</TableTd>,
    tr: ({ children }) => <TableTr>{children}</TableTr>,

    ...components,
  };
}
