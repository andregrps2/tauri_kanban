"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { CardData, LabelData } from "@/lib/types";
import { useEffect, useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";

const colorClasses = [
  "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
  "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500",
  "bg-pink-500", "bg-gray-500",
];

interface EditCardModalProps {
  card: CardData;
  allLabels: LabelData[];
  setAllLabels: (labels: LabelData[]) => void;
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: CardData) => void;
  onDelete: (cardId: string) => void;
}

export default function EditCardModal({ card, allLabels, setAllLabels, isOpen, onClose, onSave, onDelete }: EditCardModalProps) {
  const [editedCard, setEditedCard] = useState<CardData>(card);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(colorClasses[0]);

  useEffect(() => {
    setEditedCard(card);
  }, [card]);

  const handleSave = () => {
    onSave(editedCard);
  };

  const handleToggleLabel = (label: LabelData) => {
    const cardLabels = editedCard.labels || [];
    const isSelected = cardLabels.some(l => l.id === label.id);
    if (isSelected) {
      setEditedCard({ ...editedCard, labels: cardLabels.filter(l => l.id !== label.id) });
    } else {
      setEditedCard({ ...editedCard, labels: [...cardLabels, label] });
    }
  };
  
  const handleCreateLabel = () => {
    if (newLabelName.trim() === "") return;
    const newLabel: LabelData = {
      id: `label-${crypto.randomUUID()}`,
      name: newLabelName.trim(),
      color: newLabelColor,
    };
    setAllLabels([...allLabels, newLabel]);
    setNewLabelName("");
    setNewLabelColor(colorClasses[0]);
  };

  const handleDeleteLabel = (labelId: string) => {
    setAllLabels(allLabels.filter(l => l.id !== labelId));
    // Also remove from any card that has it
    const updatedCardLabels = editedCard.labels?.filter(l => l.id !== labelId) || [];
    setEditedCard({...editedCard, labels: updatedCardLabels});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={editedCard.title}
              onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedCard.description || ""}
              onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
              className="col-span-3"
              placeholder="Add a more detailed description..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
                id="dueDate"
                type="date"
                value={editedCard.dueDate || ""}
                onChange={(e) => setEditedCard({...editedCard, dueDate: e.target.value})}
                className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Labels</Label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {editedCard.labels?.map(label => (
                  <Badge key={label.id} className={`${label.color} text-white`}>
                    {label.name}
                  </Badge>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2"/>Manage Labels</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="text-sm font-medium mb-2 text-center">Labels</div>
                  <div className="space-y-1">
                    {allLabels.map(label => {
                      const isSelected = editedCard.labels?.some(l => l.id === label.id);
                      return (
                        <div key={label.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleLabel(label)}>
                                {isSelected ? <Check className="h-4 w-4" /> : <div className="w-4 h-4"/>}
                                <Badge className={`${label.color} text-white`}>{label.name}</Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteLabel(label.id)}>
                                <X className="h-4 w-4 text-muted-foreground"/>
                            </Button>
                        </div>
                      );
                    })}
                  </div>
                  <hr className="my-2"/>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Create new label</div>
                    <Input placeholder="Label name" value={newLabelName} onChange={e => setNewLabelName(e.target.value)} />
                    <div className="grid grid-cols-5 gap-1">
                        {colorClasses.map(color => (
                            <button key={color} onClick={() => setNewLabelColor(color)} className={`h-6 w-6 rounded-full ${color} flex items-center justify-center`}>
                                {newLabelColor === color && <Check className="h-4 w-4 text-white"/>}
                            </button>
                        ))}
                    </div>
                    <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreateLabel}>Create</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between w-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Card</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this card.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(card.id)} className="bg-destructive hover:bg-destructive/90">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSave} className="ml-2 bg-accent text-accent-foreground hover:bg-accent/90">Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
