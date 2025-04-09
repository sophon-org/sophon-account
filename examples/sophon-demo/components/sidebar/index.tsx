"use client";

import { Code, Group, ScrollArea } from "@mantine/core";
import { LinksGroup } from "./group";
import { Logo } from "../logo";
import classes from "./index.module.css";
import {
  BlocksIcon,
  CalendarCogIcon,
  CogIcon,
  GaugeIcon,
  NotebookTabsIcon,
  PresentationIcon,
  RadioIcon,
  ScrollTextIcon,
  StarIcon,
  WaypointsIcon,
  WebhookIcon,
  WrenchIcon,
} from "lucide-react";
import { version } from "../../../../package.json";
import { cn } from "@sophon-labs/react";

const menu = [
  {
    label: "Getting Started",
    icon: StarIcon,
    initiallyOpened: true,
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
  const links = menu.map((item) => <LinksGroup {...item} key={item.label} />);

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

      <div className={classes.footer}></div>
    </nav>
  );
}
