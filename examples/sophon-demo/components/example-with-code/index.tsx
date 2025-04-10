import { Box, Code, Paper, Tabs } from "@mantine/core";
import { CodeHighlight, CodeHighlightTabs } from "@mantine/code-highlight";
import { TypescriptIcon } from "../icons/typescript";
import { CssIcon } from "../icons/css";
import { cn } from "@sophon-labs/react";

export enum SourceLanguage {
  TSX = "tsx",
  CSS = "css",
  HTML = "html",
}

interface SourceCode {
  language: SourceLanguage;
  fileName: string;
  code: string;
}

interface Props {
  children: React.ReactNode;
  code: SourceCode[];
  className?: string;
}

function getFileIcon(fileName: string) {
  if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) {
    return <TypescriptIcon className="w-4 h-4" />;
  }

  if (fileName.endsWith(".css")) {
    return <CssIcon className="w-4 h-4" />;
  }

  return null;
}

export const ExampleWithCode = ({ code, children, className }: Props) => {
  const mappedCode = code.map((file) => {
    return {
      ...file,
      icon: getFileIcon(file.fileName),
    };
  });

  return (
    <Paper withBorder className="my-4">
      {!!children && (
        <Box
          className={cn(
            `p-4 content-center justify-items-center min-h-20`,
            className
          )}
        >
          {children}
        </Box>
      )}
      <CodeHighlightTabs
        className={!!children ? "border-t border-[#cbc4c4ee]" : ""}
        code={mappedCode}
      />
    </Paper>
  );
};
