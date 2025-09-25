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
import type { CardData, LabelData, CommentData, ChecklistData, ChecklistItemData } from "@/lib/types";
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
import { Check, Plus, Send, Trash2, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { MultiSelect } from "../ui/multi-select";
import * as ClickUpService from "@/lib/clickup-service";
import { useToast } from "@/hooks/use-toast";

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
  const [newComment, setNewComment] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    setEditedCard(card);
  }, [card]);

  const handleSave = () => {
    onSave(editedCard);
  };

  const handleLabelSelect = (selectedLabelIds: string[]) => {
    const selectedLabels = allLabels.filter(label => selectedLabelIds.includes(label.id));
    setEditedCard({ ...editedCard, labels: selectedLabels });
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

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const createdComment = await ClickUpService.createTaskComment(editedCard.id, newComment.trim());
      const comment: CommentData = {
          id: createdComment.id,
          text: newComment.trim(),
          timestamp: new Date().toISOString(),
      };
      const updatedComments = [...(editedCard.comments || []), comment].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setEditedCard({ ...editedCard, comments: updatedComments });
      setNewComment("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add comment",
        description: error.message,
      });
    }
  };

  const handleAddChecklist = async () => {
    if (newChecklistTitle.trim() === "") return;
    try {
      const response = await ClickUpService.createChecklist(editedCard.id, newChecklistTitle);
      const checklist = response.checklist;
      const newChecklist: ChecklistData = {
        id: checklist.id,
        title: checklist.name,
        items: [],
      };
      setEditedCard({ ...editedCard, checklists: [...(editedCard.checklists || []), newChecklist]});
      setNewChecklistTitle("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add checklist",
        description: error.message,
      });
    }
  };

  const handleDeleteChecklist = async (checklistId: string) => {
    try {
      await ClickUpService.deleteChecklist(checklistId);
      setEditedCard({ ...editedCard, checklists: editedCard.checklists?.filter(c => c.id !== checklistId) });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Failed to delete checklist",
        description: error.message,
      });
    }
  };

  const handleAddChecklistItem = async (checklistId: string) => {
    const text = newChecklistItem[checklistId]?.trim();
    if (!text) return;
    try {
      const { item } = await ClickUpService.createChecklistItem(checklistId, text);
      const newItem: ChecklistItemData = {
        id: item.id,
        text: item.name,
        completed: false,
      };
      const updatedChecklists = editedCard.checklists?.map(c => 
        c.id === checklistId ? { ...c, items: [...c.items, newItem] } : c
      );
      setEditedCard({ ...editedCard, checklists: updatedChecklists });
      setNewChecklistItem({ ...newChecklistItem, [checklistId]: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add checklist item",
        description: error.message,
      });
    }
  };

  const handleToggleChecklistItem = async (checklistId: string, itemId: string, currentStatus: boolean) => {
    try {
      await ClickUpService.updateChecklistItem(checklistId, itemId, { resolved: !currentStatus });
      const updatedChecklists = editedCard.checklists?.map(c => {
        if (c.id === checklistId) {
          return {
            ...c,
            items: c.items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        }
        return c;
      });
      setEditedCard({ ...editedCard, checklists: updatedChecklists });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update checklist item",
        description: error.message,
      });
    }
  };

  const handleDeleteChecklistItem = async (checklistId: string, itemId: string) => {
    try {
      await ClickUpService.deleteChecklistItem(checklistId, itemId);
      const updatedChecklists = editedCard.checklists?.map(c => {
        if (c.id === checklistId) {
          return { ...c, items: c.items.filter(item => item.id !== itemId) };
        }
        return c;
      });
      setEditedCard({ ...editedCard, checklists: updatedChecklists });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Failed to delete checklist item",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 py-4">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedCard.title}
                onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedCard.description || ""}
                onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                placeholder="Add a more detailed description..."
                rows={5}
              />
            </div>
            
            <Tabs defaultValue="comments" className="w-full">
              <TabsList>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="checklists">Checklists</TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                 <div className="space-y-2">
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 border rounded-md p-2 mt-2">
                        {editedCard.comments?.map(comment => (
                            <div key={comment.id} className="text-sm p-2 bg-muted/50 rounded-md">
                                <p className="whitespace-pre-wrap">{comment.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(comment.timestamp).toLocaleString()}
                                </p>
                            </div>
                        ))}
                        {(!editedCard.comments || editedCard.comments.length === 0) && (
                            <p className="text-sm text-center text-muted-foreground py-4">No comments yet.</p>
                        )}
                    </div>
                    <div className="flex items-start space-x-2">
                        <Textarea 
                            placeholder="Write a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-grow"
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment();
                              }
                            }}
                        />
                        <Button onClick={handleAddComment} size="icon" className="flex-shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="checklists">
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mt-2">
                  {editedCard.checklists?.map(checklist => {
                    const completedItems = checklist.items.filter(i => i.completed).length;
                    const progress = checklist.items.length > 0 ? (completedItems / checklist.items.length) * 100 : 0;
                    return (
                      <div key={checklist.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{checklist.title}</h4>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteChecklist(checklist.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground"/>
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                          <Progress value={progress} className="w-full h-2"/>
                        </div>
                        <div className="space-y-1 pl-2">
                          {checklist.items.map(item => (
                            <div key={item.id} className="flex items-center gap-2 group">
                              <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => handleToggleChecklistItem(checklist.id, item.id, item.completed)} />
                              <label htmlFor={item.id} className="flex-grow text-sm data-[completed=true]:line-through data-[completed=true]:text-muted-foreground" data-completed={item.completed}>{item.text}</label>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteChecklistItem(checklist.id, item.id)}>
                                <X className="h-4 w-4 text-muted-foreground"/>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                          <Input 
                            placeholder="Add an item"
                            value={newChecklistItem[checklist.id] || ""}
                            onChange={(e) => setNewChecklistItem({...newChecklistItem, [checklist.id]: e.target.value})}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem(checklist.id)}
                            className="h-8"
                          />
                          <Button size="sm" onClick={() => handleAddChecklistItem(checklist.id)}>Add</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-4 border-t pt-4">
                  <Input 
                    placeholder="Add new checklist"
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                  />
                  <Button onClick={handleAddChecklist} className="bg-accent text-accent-foreground hover:bg-accent/90">Add Checklist</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                    id="dueDate"
                    type="date"
                    value={editedCard.dueDate || ""}
                    onChange={(e) => setEditedCard({...editedCard, dueDate: e.target.value})}
                />
            </div>
            <div className="space-y-2">
              <Label>Labels</Label>
              <MultiSelect
                options={allLabels.map(l => ({ value: l.id, label: l.name, color: l.color }))}
                onValueChange={handleLabelSelect}
                defaultValue={editedCard.labels?.map(l => l.id) || []}
                placeholder="Select labels..."
              >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start"><Plus className="h-4 w-4 mr-2"/>Manage Labels</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <div className="text-sm font-medium mb-2 text-center">Labels</div>
                      <div className="space-y-1">
                        {allLabels.map(label => (
                          <div key={label.id} className="flex items-center justify-between">
                              <Badge className={`${label.color} text-white`}>{label.name}</Badge>
                               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteLabel(label.id)}>
                                  <X className="h-4 w-4 text-muted-foreground"/>
                              </Button>
                          </div>
                        ))}
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
              </MultiSelect>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between w-full pt-4 border-t">
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
