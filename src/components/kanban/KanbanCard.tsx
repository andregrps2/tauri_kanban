"use client";

import type { CardData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  card: CardData;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  className?: string;
}

export default function KanbanCard({ card, onDragStart, onDragEnd, onClick, className }: KanbanCardProps) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn("cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow", className)}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map(label => (
              <Badge key={label.id} className={`${label.color} text-white text-xs`} variant="default">
                {label.name}
              </Badge>
            ))}
          </div>
        )}
        {card.description && (
          <p className="text-sm text-muted-foreground truncate">{card.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
