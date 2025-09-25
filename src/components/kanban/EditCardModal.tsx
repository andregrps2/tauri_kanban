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
import type { CardData, LabelData, CommentData, ChecklistData, ChecklistItemData, UserData } from "@/lib/types";
import { useEffect, useState, useRef, useCallback } from "react";
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
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { MultiSelect } from "../ui/multi-select";
import * as ClickUpService from "@/lib/clickup-service";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  onUpdate: (updatedCard: CardData) => void;
}

export default function EditCardModal({ card, allLabels, setAllLabels, isOpen, onClose, onSave, onDelete, onUpdate }: EditCardModalProps) {
  const [editedCard, setEditedCard] = useState<CardData>(card);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState(colorClasses[0]);
  const [newComment, setNewComment] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [pendingItems, setPendingItems] = useState<Record<string, string[]>>({});
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedCard(card);
  }, [card]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [editedCard.comments]);


  const handleSave = () => {
    onSave(editedCard);
  };
  
  const refreshTaskState = async () => {
    try {
        const taskDetails = await ClickUpService.getTask(editedCard.id);
        const formattedChecklists = (taskDetails.checklists || []).map((c: any) => ({
            id: c.id,
            title: c.name,
            items: (c.items || []).map((i: any) => ({
                id: i.id,
                text: i.name,
                completed: i.resolved,
                orderindex: i.orderindex,
            })),
        }));
        const updatedCard = { ...editedCard, checklists: formattedChecklists };
        setEditedCard(updatedCard);
        onUpdate(updatedCard); // Propagate the change up to the board
    } catch (error: any)
{        toast({
            variant: "destructive",
            title: "Failed to refresh task details",
            description: error.message,
        });
    }
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
      await ClickUpService.createTaskComment(editedCard.id, newComment.trim());
      // After adding, we need to refresh to get the full comment object with user details
      const comments = await ClickUpService.getTaskComments(editedCard.id);
      const formattedComments = comments.map((c: any) => ({
        id: c.id,
        text: c.comment_text,
        timestamp: new Date(parseInt(c.date)).toISOString(),
        user: {
          id: c.user.id,
          username: c.user.username,
          color: c.user.color,
          profilePicture: c.user.profilePicture,
        }
      })).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      const updatedCard = { ...editedCard, comments: formattedComments };
      setEditedCard(updatedCard);
      onUpdate(updatedCard);
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
      await ClickUpService.createChecklist(editedCard.id, newChecklistTitle);
      setNewChecklistTitle("");
      await refreshTaskState(); // Refresh the entire task state
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
  
  const processPendingItems = useCallback(async () => {
    const checklistIdsWithPendingItems = Object.keys(pendingItems).filter(
      (id) => pendingItems[id].length > 0
    );

    if (checklistIdsWithPendingItems.length === 0) return;

    for (const checklistId of checklistIdsWithPendingItems) {
      const itemsToCreate = pendingItems[checklistId];
      // Create items sequentially to preserve order
      for (const itemName of itemsToCreate) {
        try {
          // Calculate orderindex based on existing + pending items before this one
          const currentChecklist = editedCard.checklists?.find(c => c.id === checklistId);
          const existingItemCount = currentChecklist?.items.length || 0;
          await ClickUpService.createChecklistItem(checklistId, itemName, existingItemCount);
        } catch (error) {
          console.error(`Failed to create item "${itemName}"`, error);
          // Optionally show a toast for failed items
        }
      }
    }
    
    setPendingItems({}); // Clear the queue
    await refreshTaskState(); // Refresh with all new items and correct IDs

  }, [pendingItems, editedCard.checklists, toast, refreshTaskState]);
  
  const handleAddChecklistItem = (checklistId: string) => {
    const text = newChecklistItem[checklistId]?.trim();
    if (!text) return;

    // Optimistic UI update
    const tempItemId = `temp-${crypto.randomUUID()}`;
    const newItem: ChecklistItemData = {
      id: tempItemId,
      text,
      completed: false,
      orderindex: editedCard.checklists?.find(c => c.id === checklistId)?.items.length || 0,
    };
    
    setEditedCard(prevCard => ({
      ...prevCard,
      checklists: prevCard.checklists?.map(c => 
        c.id === checklistId ? { ...c, items: [...c.items, newItem] } : c
      )
    }));
    
    setNewChecklistItem({ ...newChecklistItem, [checklistId]: "" });

    // Add to pending queue
    setPendingItems(prev => ({
      ...prev,
      [checklistId]: [...(prev[checklistId] || []), text],
    }));

    // Debounce the processing
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(processPendingItems, 2500);
  };
  
  const handleToggleChecklistItem = async (checklistId: string, itemId: string, currentStatus: boolean) => {
    // If the item is a temporary one, don't do anything
    if (itemId.startsWith('temp-')) return;
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
    // If the item is a temporary one, just remove from UI and pending queue
    if (itemId.startsWith('temp-')) {
        const itemToRemove = editedCard.checklists?.find(c => c.id === checklistId)?.items.find(i => i.id === itemId);
        if (itemToRemove) {
             setPendingItems(prev => ({
                ...prev,
                [checklistId]: (prev[checklistId] || []).filter(name => name !== itemToRemove.text)
            }));
        }
    } else {
        try {
            await ClickUpService.deleteChecklistItem(checklistId, itemId);
        } catch (error: any) {
           toast({
            variant: "destructive",
            title: "Failed to delete checklist item",
            description: error.message,
          });
          return; // Don't update UI if API call fails
        }
    }

    // Optimistic UI update for both cases
    const updatedChecklists = editedCard.checklists?.map(c => {
      if (c.id === checklistId) {
        return { ...c, items: c.items.filter(item => item.id !== itemId) };
      }
      return c;
    });
    setEditedCard({ ...editedCard, checklists: updatedChecklists });
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-9 gap-x-8 gap-y-4 py-4">
          {/* Main Content Column */}
          <div className="md:col-span-5 space-y-4">
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
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Checklists</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mt-2">
                {editedCard.checklists?.map((checklist) => {
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
                        {checklist.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 group">
                            <Checkbox id={`${checklist.id}-${item.id}`} checked={item.completed} onCheckedChange={() => handleToggleChecklistItem(checklist.id, item.id, item.completed)} />
                            <label htmlFor={`${checklist.id}-${item.id}`} className="flex-grow text-sm data-[completed=true]:line-through data-[completed=true]:text-muted-foreground" data-completed={item.completed}>{item.text}</label>
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
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 space-y-4">
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
            <div className="space-y-4">
              <Label>Comments</Label>
              <div ref={commentsContainerRef} className="space-y-3 overflow-y-auto pr-2 border rounded-md p-3 mt-2 max-h-96">
                  {editedCard.comments?.map(comment => (
                      <div key={comment.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.user.profilePicture || undefined} alt={comment.user.username} />
                              <AvatarFallback style={{backgroundColor: comment.user.color}}>
                                  {getInitials(comment.user.username)}
                              </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                              <div>
                                <span className="font-semibold text-sm">{comment.user.username}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(comment.timestamp).toLocaleString(undefined, {
                                      year: 'numeric', month: 'numeric', day: 'numeric',
                                      hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap mt-1">{comment.text}</p>
                          </div>
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
