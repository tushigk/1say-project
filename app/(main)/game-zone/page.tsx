import { GameZoneListView } from "@/components/views/GameZoneListView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Zone | AI Powered Games",
  description: "Experience unique AI-powered games and challenges.",
};

export default function GameZonePage() {
  return <GameZoneListView />;
}
