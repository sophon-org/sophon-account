"use client";

import { Code, Group, ScrollArea, Text } from "@mantine/core";
import { LinksGroup } from "./group";
import { Logo } from "../logo";
import classes from "./index.module.css";
import {
  BlocksIcon,
  CogIcon,
  RadioIcon,
  ScrollTextIcon,
  StarIcon,
  WaypointsIcon,
  WebhookIcon,
  WrenchIcon,
} from "lucide-react";
import { version } from "../../../../package.json";
import { cn } from "@sophon-labs/react";
import { usePathname, useRouter } from "next/navigation";

const menu = [
  {
    label: "Getting Started",
    icon: StarIcon,
    links: [
      { label: "Welcome", link: "/getting-started" },
      { label: "Best Practices", link: "/getting-started/best-practices" },
      { label: "Security", link: "/getting-started/security" },
      { label: "FAQ", link: "/getting-started/faq" },
      { label: "Rate Limits", link: "/getting-started/rate-limits" },
    ],
  },
  { label: "Changelog", icon: ScrollTextIcon, link: "/changelog" },
  {
    label: "Configuration",
    icon: CogIcon,
    links: [
      { label: "Using Wagmi", link: "/configuration/wagmi" },
      { label: "Using Ethers", link: "/configuration/ethers" },
    ],
  },
  {
    label: "Provider & Connector",
    icon: WaypointsIcon,
    links: [
      { label: "General Overview", link: "/context/overview" },
      { label: "SophonContextProvider", link: "/context/provider" },
      { label: "SophonConnector", link: "/context/connector" },
    ],
  },
  {
    label: "UI & Layout",
    icon: BlocksIcon,
    links: [
      { label: "Overview", link: "/ui/overview" },
      { label: "Widget", link: "/ui/widget" },
      { label: "Embedded", link: "/ui/embedded" },
      { label: "Connect Button", link: "/ui/connect-button" },
    ],
  },
  {
    label: "Hooks",
    icon: WebhookIcon,
    links: [
      { label: "Overview", link: "/hooks/overview" },
      { label: "useSophon", link: "/hooks/use-sophon" },
    ],
  },
  {
    label: "Events",
    icon: RadioIcon,
    links: [
      { label: "Overview", link: "/events/overview" },
      { label: "useSophon", link: "/events/use-sophon" },
    ],
  },
  {
    label: "Utilities",
    icon: WrenchIcon,
    links: [{ label: "shortenAddress", link: "/utilities/shorten-address" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const links = menu.map((item) => {
    const isOpen = (item.links ?? []).some((link) => pathname === link.link);
    return <LinksGroup {...item} key={item.label} initiallyOpened={isOpen} />;
  });

  return (
    <nav className={cn(classes.navbar, "h-screen")}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo />
          <Code fw={700}>v{version}</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Text c="dimmed" size="sm" ta="center">
          Made with ❤️ by Sophon
        </Text>
      </div>
    </nav>
  );
}
