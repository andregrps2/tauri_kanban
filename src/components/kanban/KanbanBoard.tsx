"use client";

import type { ColumnData, CardData } from "@/lib/types";
import { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import EditCardModal from "./EditCardModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const defaultColumns: ColumnData[] = [
  {
    id: "col-1",
    title: "To Do",
    cards: [
      { id: "card-1", title: "Design the UI", description: "Create mockups and wireframes in Figma." },
      { id: "card-2", title: "Develop the Kanban board component", description: "Use Next.js and shadcn/ui." },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    cards: [
      { id: "card-3", title: "Implement drag and drop functionality", description: "Use HTML5 Drag and Drop API." },
    ],
  },
  {
    id: "col-3",
    title: "Done",
    cards: [
       { id: "card-4", title: "Set up Next.js project", description: "Initialize with create-next-app." },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingCard, setEditingCard] = useState<CardData | null>(null);

  useEffect(() => {
    try {
      const savedBoard = localStorage.getItem('kanbanBoard');
      if (savedBoard) {
        setColumns(JSON.parse(savedBoard));
      } else {
        setColumns(defaultColumns);
      }
    } catch (error) {
      console.error("Failed to parse board data from localStorage", error);
      setColumns(defaultColumns);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kanbanBoard', JSON.stringify(columns));
    }
  }, [columns, isLoaded]);

  const handleAddColumn = () => {
    if (newColumnName.trim() === "") return;
    const newColumn: ColumnData = {
      id: `col-${crypto.randomUUID()}`,
      title: newColumnName,
      cards: [],
    };
    setColumns([...columns, newColumn]);
    setNewColumnName("");
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
  };
  
  const handleAddCard = (columnId: string, cardTitle: string) => {
    const newCard: CardData = {
      id: `card-${crypto.randomUUID()}`,
      title: cardTitle,
      description: "",
    };
    const newColumns = columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, cards: [...col.cards, newCard] };
      }
      return col;
    });
    setColumns(newColumns);
  };

  const handleUpdateCard = (updatedCard: CardData) => {
    const newColumns = columns.map((col) => ({
      ...col,
      cards: col.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    }));
    setColumns(newColumns);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    const newColumns = columns.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => card.id !== cardId),
    }));
    setColumns(newColumns);
    setEditingCard(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: CardData, sourceColumnId: string) => {
    e.dataTransfer.setData("cardInfo", JSON.stringify({ cardId: card.id, sourceColumnId }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    const { cardId, sourceColumnId } = JSON.parse(e.dataTransfer.getData("cardInfo"));
    
    if (sourceColumnId === targetColumnId) return;

    let cardToMove: CardData | undefined;
    const newColumns = columns.map(col => {
        if (col.id === sourceColumnId) {
            cardToMove = col.cards.find(card => card.id === cardId);
            return { ...col, cards: col.cards.filter(card => card.id !== cardId) };
        }
        return col;
    });

    if (cardToMove) {
        const finalColumns = newColumns.map(col => {
            if (col.id === targetColumnId) {
                return { ...col, cards: [...col.cards, cardToMove!] };
            }
            return col;
        });
        setColumns(finalColumns);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex space-x-4 p-4 h-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-80 flex-shrink-0">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start p-4 space-x-4 overflow-x-auto h-full">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onAddCard={handleAddCard}
            onDeleteColumn={handleDeleteColumn}
            onCardDrop={handleDrop}
            onDragStartCard={handleDragStart}
            onCardClick={setEditingCard}
          />
        ))}
        <div className="w-80 flex-shrink-0 p-2 rounded-lg bg-primary/10">
            <h3 className="font-semibold mb-2 px-2">Add New Column</h3>
            <div className="flex space-x-2">
              <Input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Column Name"
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
              />
              <Button onClick={handleAddColumn} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>
      {editingCard && (
        <EditCardModal
          card={editingCard}
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}
    </>
  );
}
