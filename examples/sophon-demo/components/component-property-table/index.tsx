import { InlineCodeHighlight } from "@mantine/code-highlight";
import {
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import React from "react";

interface Property {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

interface Props {
  componentClass: React.ComponentType<unknown>;
  properties: Property[];
}

export const ComponentPropertyTable = ({
  componentClass,
  properties,
}: Props) => {
  return (
    <Table striped highlightOnHover>
      <TableThead>
        <TableTr>
          <TableTh>Name</TableTh>
          <TableTh>Type</TableTh>
          <TableTh>Description</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {properties.map((property) => (
          <TableTr key={`${componentClass.name}-${property.name}`}>
            <TableTd>
              {property.name}
              {property.required ? "*" : undefined}
            </TableTd>
            <TableTd>
              <InlineCodeHighlight code={property.type} language="tsx" />
            </TableTd>
            <TableTd>{property.description}</TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
};
