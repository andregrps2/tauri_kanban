"use client";

import type { ColumnData, CardData } from "@/lib/types";
import { useState } from "react";
import KanbanCard from "./KanbanCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface KanbanColumnProps {
  column: ColumnData;
  onAddCard: (columnId: string, cardTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onCardDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragStartCard: (e: React.DragEvent<HTMLDivElement>, card: CardData, sourceColumnId: string) => void;
  onCardClick: (card: CardData) => void;
}

export default function KanbanColumn({
  column,
  onAddCard,
  onDeleteColumn,
  onCardDrop,
  onDragStartCard,
  onCardClick,
}: KanbanColumnProps) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim() === "") return;
    onAddCard(column.id, newCardTitle);
    setNewCardTitle("");
    setIsAddingCard(false);
  };
  
  return (
    <div
      className={cn(
        "w-80 flex-shrink-0 bg-card rounded-lg shadow-sm flex flex-col transition-colors duration-300",
        isDraggingOver && "bg-primary/20"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragEnter={() => setIsDraggingOver(true)}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        setIsDraggingOver(false);
        onCardDrop(e, column.id);
      }}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{column.title}</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the "{column.title}" column and all its cards. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteColumn(column.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="p-2 space-y-2 flex-grow overflow-y-auto">
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onDragStart={(e) => onDragStartCard(e, card, column.id)}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>
      
      <Collapsible open={isAddingCard} onOpenChange={setIsAddingCard} className="p-2 border-t">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" /> Add a card
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-2">
          <Input
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
          />
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddCard} className="bg-accent text-accent-foreground hover:bg-accent/90">Add Card</Button>
            <Button variant="ghost" onClick={() => setIsAddingCard(false)}>Cancel</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
