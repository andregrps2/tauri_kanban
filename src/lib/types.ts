export interface LabelData {
  id: string;
  name: string;
  color: string; // e.g., 'bg-red-500', 'bg-blue-500'
}

export interface CommentData {
  id: string;
  text: string;
  timestamp: string;
}

export interface ChecklistItemData {
  id: string;
  text: string;
  completed: boolean;
  orderindex: number;
}

export interface ChecklistData {
  id: string;
  title: string;
  items: ChecklistItemData[];
}

export interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels?: LabelData[];
  comments?: CommentData[];
  checklists?: ChecklistData[];
  statusId?: string; // To know which column it belongs to
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}
