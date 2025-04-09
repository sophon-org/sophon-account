"use client";

import { useState } from "react";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import classes from "./group.module.css";
import { CalendarClockIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={Link}
      className={classes.link}
      href={link.link}
      key={link.label}
      //   onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  const router = useRouter();

  return (
    <>
      <UnstyledButton
        component={Link}
        href={link || "#"}
        onClick={() => {
          setOpened((o) => !o);
          if (link) {
            router.push(link);
          }
        }}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronRightIcon
              className={classes.chevron}
              strokeWidth={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
