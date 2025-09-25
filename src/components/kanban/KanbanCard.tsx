"use client";

import type { CardData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface KanbanCardProps {
  card: CardData;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

export default function KanbanCard({ card, onDragStart, onClick }: KanbanCardProps) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base">{card.title}</CardTitle>
      </CardHeader>
      {card.description && (
        <CardContent className="px-4 pb-4 pt-0">
          <p className="text-sm text-muted-foreground truncate">{card.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
