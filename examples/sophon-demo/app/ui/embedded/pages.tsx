"use client";
import {
  ExampleWithCode,
  SourceLanguage,
} from "@/components/example-with-code";
import { Box, Title } from "@mantine/core";
import { SophonEmbeddedWidget, SophonWidget } from "@sophon-labs/react";


const EmbeddedExamplesPage = () => {
  return (
    <>
      <Title order={1} className="pb-10">
        Sophon Embedded Panel Examples
      </Title>
      <Title order={2}>Embedded Widget Without Background</Title>
      <ExampleWithCode
        code={[
          {
            language: SourceLanguage.TSX,
            fileName: "ButtonWithDropdown.tsx",
            code: `import { SophonWidget } from "@sophon-labs/react";
// TODO: Add code`,
          },
        ]}
      >
        <Box className="my-10">
          <SophonEmbeddedWidget background="none" />
        </Box>
      </ExampleWithCode>
      <Title order={2}>Embedded Widget With Background</Title>
      <ExampleWithCode
        code={[
          {
            language: SourceLanguage.TSX,
            fileName: "ButtonWithDropdown.tsx",
            code: `import { SophonWidget } from "@sophon-labs/react";
// TODO: Add code`,
          },
        ]}
      >
        <Box className="my-10">
          <SophonEmbeddedWidget background="default" />
        </Box>
      </ExampleWithCode>
      <Title order={2}>Embedded Widget With Border</Title>
      <ExampleWithCode
        code={[
          {
            language: SourceLanguage.TSX,
            fileName: "ButtonWithDropdown.tsx",
            code: `import { SophonWidget } from "@sophon-labs/react";
// TODO: Add code`,
          },
        ]}
      >
        <Box className="my-10">
          <SophonEmbeddedWidget background="with-border" />
        </Box>
      </ExampleWithCode>
      <Title order={2}>Embedded Widget With Custom Style</Title>
      <ExampleWithCode
        code={[
          {
            language: SourceLanguage.TSX,
            fileName: "ButtonWithDropdown.tsx",
            code: `import { SophonWidget } from "@sophon-labs/react";
// TODO: Add code`,
          },
        ]}
      >
        <Box className="my-10">
          <SophonEmbeddedWidget
            background="default"
            style={{
              border: "1px solid red",
              borderRadius: "26px",
            }}
          />
        </Box>
      </ExampleWithCode>
    </>
  );
};

export default EmbeddedExamplesPage;
