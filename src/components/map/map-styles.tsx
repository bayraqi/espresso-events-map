"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapIcon,
  MoonIcon,
  SatelliteIcon,
  SunIcon,
  TreesIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useMap } from "@/context/map-context";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

type StyleOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  url: string;
};

export default function MapStyles() {
  const { map } = useMap();
  const { setTheme, resolvedTheme } = useTheme();
  const styleOptions = useMemo<StyleOption[]>(() => {
    const options: StyleOption[] = [];
    const defaults: Array<[string, string | undefined, React.ReactNode]> = [
      [
        "Default",
        process.env.NEXT_PUBLIC_MAP_STYLE_URL,
        <MapIcon key="icon-default" className="w-5 h-5" />,
      ],
      [
        "Alt 1",
        process.env.NEXT_PUBLIC_MAP_STYLE_URL_ALT1,
        <SunIcon key="icon-alt1" className="w-5 h-5" />,
      ],
      [
        "Alt 2",
        process.env.NEXT_PUBLIC_MAP_STYLE_URL_ALT2,
        <MoonIcon key="icon-alt2" className="w-5 h-5" />,
      ],
      [
        "Terrain",
        process.env.NEXT_PUBLIC_MAP_STYLE_URL_TERRAIN,
        <TreesIcon key="icon-terrain" className="w-5 h-5" />,
      ],
      [
        "Satellite",
        process.env.NEXT_PUBLIC_MAP_STYLE_URL_SATELLITE,
        <SatelliteIcon key="icon-satellite" className="w-5 h-5" />,
      ],
    ];
    let i = 0;
    for (const [label, url, icon] of defaults) {
      if (url) options.push({ id: `style-${i++}`, label, icon, url });
    }
    return options;
  }, []);

  const [activeStyle, setActiveStyle] = useState(styleOptions[0]?.id ?? "");

  const handleChange = (value: string) => {
    if (!map) return;
    const sel = styleOptions.find((s) => s.id === value);
    if (!sel) return;
    map.setStyle(sel.url);
    setActiveStyle(value);
  };

  // Keep theme in sync when user picks a style from the tabs
  useEffect(() => {
    const darkUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL_ALT2;
    const sel = styleOptions.find((s) => s.id === activeStyle);
    if (!sel) return;
    const desired = darkUrl && sel.url === darkUrl ? "dark" : "light";
    if (desired !== resolvedTheme) setTheme(desired);
  }, [activeStyle, styleOptions, setTheme, resolvedTheme]);

  // Keep map style in sync when theme changes (or on first load)
  useEffect(() => {
    if (!map) return;
    const darkUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL_ALT2;
    const lightUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;

    const toUrl = resolvedTheme === "dark" ? darkUrl : lightUrl;
    if (!toUrl) return;

    const current = styleOptions.find((s) => s.id === activeStyle);
    if (current?.url === toUrl) return;

    const match = styleOptions.find((s) => s.url === toUrl) ?? styleOptions[0];
    if (!match) return;
    map.setStyle(match.url);
    setActiveStyle(match.id);
  }, [map, resolvedTheme, styleOptions, activeStyle]);

  return (
    styleOptions.length > 0 ? (
      <aside className="absolute bottom-4 left-4 z-10">
        <Tabs value={activeStyle} onValueChange={handleChange}>
          <TabsList className="bg-background shadow-lg">
            {styleOptions.map((style) => (
              <TabsTrigger
                key={style.id}
                value={style.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm flex items-center sm:px-3 sm:py-1.5"
              >
                {style.icon}
                <span className="hidden sm:inline">{style.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </aside>
    ) : null
  );
}
