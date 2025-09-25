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

export interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels?: LabelData[];
  comments?: CommentData[];
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}
