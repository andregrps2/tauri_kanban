"use client";

import type { ColumnData, CardData, LabelData } from "@/lib/types";
import { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import EditCardModal from "./EditCardModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import * as ClickUpService from "@/lib/clickup-service";
import { useToast } from "@/hooks/use-toast";

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = await ClickUpService.getListStatuses();
        const tasks = await ClickUpService.getTasks();

        // Map ClickUp statuses to our ColumnData format
        const boardColumns: ColumnData[] = statuses.map((status: any) => ({
          id: status.id,
          title: status.status,
          cards: [], // We'll populate this next
        }));

        // Map ClickUp tasks to our CardData format
        const boardCards: CardData[] = tasks.map((task: any) => ({
          id: task.id,
          title: task.name,
          description: task.description || "",
          statusId: task.status.id,
          dueDate: task.due_date ? new Date(parseInt(task.due_date)).toISOString().split('T')[0] : undefined,
          labels: task.tags.map((tag: any) => ({
            id: tag.name, // ClickUp tags don't have a stable ID via this endpoint
            name: tag.name,
            color: 'bg-gray-500' // ClickUp API doesn't provide tag colors here
          })),
          comments: [], // Comments would need a separate fetch
          checklists: (task.checklists || []).map((c: any) => ({
            id: c.id,
            title: c.name,
            items: c.items.map((i: any) => ({
              id: i.id,
              text: i.name,
              completed: i.resolved,
            })).sort((a:any, b:any) => a.orderindex - b.orderindex),
          })),
        }));

        // Distribute cards into their respective columns
        boardColumns.forEach(col => {
          col.cards = boardCards.filter(card => card.statusId === col.id);
        });

        // Collect all unique labels
        const allBoardLabels = boardCards.flatMap(card => card.labels || [])
          .filter((label, index, self) => 
            index === self.findIndex((l) => l.id === label.id)
          );

        setColumns(boardColumns);
        setAllCards(boardCards);
        setLabels(allBoardLabels);

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load data from ClickUp",
          description: error.message,
        });
        console.error(error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleCardClick = async (card: CardData) => {
    try {
      setEditingCard(card);
      
      const comments = await ClickUpService.getTaskComments(card.id);

      const formattedComments = comments.map((c: any) => ({
        id: c.id,
        text: c.comment_text,
        timestamp: new Date(parseInt(c.date)).toISOString(),
      })).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const updatedCard = { ...card, comments: formattedComments };
      setEditingCard(updatedCard);
      
      const newColumns = columns.map(col => ({
        ...col,
        cards: col.cards.map(c => c.id === card.id ? updatedCard : c)
      }));
      setColumns(newColumns);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load card details",
        description: error.message,
      });
    }
  };


  const handleAddColumn = () => {
    toast({ title: "Note", description: "Column management should be done in ClickUp." });
  };

  const handleDeleteColumn = (columnId: string) => {
    toast({ title: "Note", description: "Column management should be done in ClickUp." });
  };
  
  const handleAddCard = async (columnId: string, cardTitle: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column) return;

    try {
      const newTask = await ClickUpService.createTask(cardTitle, column.title);
      const newCard: CardData = {
        id: newTask.id,
        title: newTask.name,
        statusId: column.id,
      };
      const newColumns = columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cards: [...col.cards, newCard] };
        }
        return col;
      });
      setColumns(newColumns);
    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Failed to create card",
          description: error.message,
        });
    }
  };

  const handleUpdateCard = async (updatedCard: CardData) => {
    try {
      // Optimistic update for UI responsiveness
      const newColumns = columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        ),
      }));
      setColumns(newColumns);
      
      // API call to update the task details
      await ClickUpService.updateTask(updatedCard.id, {
        name: updatedCard.title,
        description: updatedCard.description,
        due_date: updatedCard.dueDate ? new Date(updatedCard.dueDate).getTime() : null,
      });
      
      // Close modal after all updates
      setEditingCard(null);

    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Failed to update card",
          description: error.message,
        });
        // Here you might want to revert the optimistic update
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
       // Optimistic delete
      const newColumns = columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }));
      setColumns(newColumns);
      setEditingCard(null);

      // API call
      await ClickUpService.deleteTask(cardId);
      
    } catch(error: any) {
       toast({
          variant: "destructive",
          title: "Failed to delete card",
          description: error.message,
        });
       // Revert optimistic delete if API call fails
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: CardData, sourceColumnId: string) => {
    e.dataTransfer.setData("cardInfo", JSON.stringify({ cardId: card.id, sourceColumnId }));
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    const { cardId, sourceColumnId } = JSON.parse(e.dataTransfer.getData("cardInfo"));
    
    if (sourceColumnId === targetColumnId) return;

    let cardToMove: CardData | undefined;
    
    // Find the card and remove it from the source column (optimistic update)
    const newColumns = columns.map(col => {
        if (col.id === sourceColumnId) {
            cardToMove = col.cards.find(card => card.id === cardId);
            return { ...col, cards: col.cards.filter(card => card.id !== cardId) };
        }
        return col;
    });

    if (cardToMove) {
        // Add the card to the target column (optimistic update)
        const finalColumns = newColumns.map(col => {
            if (col.id === targetColumnId) {
                return { ...col, cards: [...col.cards, { ...cardToMove!, statusId: col.id }] };
            }
            return col;
        });
        setColumns(finalColumns);
        
        // API Call
        try {
          const targetColumn = finalColumns.find(c => c.id === targetColumnId);
          if (!targetColumn) throw new Error("Target column not found");
          await ClickUpService.updateTask(cardId, { status: targetColumn.title });
        } catch (error: any) {
           toast({
              variant: "destructive",
              title: "Failed to move card",
              description: error.message,
            });
          // Revert state on failure
        }
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
            onDragEndCard={handleDragEnd}
            onCardClick={handleCardClick}
          />
        ))}
        <div className="w-80 flex-shrink-0 p-2 rounded-lg bg-primary/10">
            <h3 className="font-semibold mb-2 px-2">Add New Column</h3>
            <div className="flex space-x-2">
              <Input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Enter in ClickUp"
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                disabled
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
          allLabels={labels}
          setAllLabels={setLabels}
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          onSave={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}
    </>
  );
}
