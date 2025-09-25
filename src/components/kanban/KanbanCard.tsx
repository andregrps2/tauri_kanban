"use client";

import type { CardData } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { CheckSquare, MessageSquare } from "lucide-react";

interface KanbanCardProps {
  card: CardData;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  className?: string;
}

export default function KanbanCard({ card, onDragStart, onDragEnd, onClick, className }: KanbanCardProps) {
  const commentCount = card.comments?.length || 0;

  const allChecklistItems = card.checklists?.flatMap(c => c.items) || [];
  const completedChecklistItems = allChecklistItems.filter(i => i.completed).length;
  const totalChecklistItems = allChecklistItems.length;
  const hasChecklistItems = totalChecklistItems > 0;
  
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn("cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow flex flex-col", className)}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 flex-grow">
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
      {(commentCount > 0 || hasChecklistItems) && (
        <CardFooter className="px-4 pb-2 pt-0 flex justify-end items-center gap-3">
          {hasChecklistItems && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{completedChecklistItems}/{totalChecklistItems}</span>
              <CheckSquare className="h-4 w-4 ml-1" />
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{commentCount}</span>
              <MessageSquare className="h-4 w-4 ml-1" />
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
