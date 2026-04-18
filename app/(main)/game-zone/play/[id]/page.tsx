'use client';

import { GameZonePlayView } from "@/components/views/GameZonePlayView";
import { useParams } from "next/navigation";

export default function GameZonePlayPage() {
  const params = useParams();
  const id = params.id as string;

  return <GameZonePlayView gameId={id} />;
}
