export interface LabelData {
  id: string;
  name: string;
  color: string; // e.g., 'bg-red-500', 'bg-blue-500'
}

export interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels?: LabelData[];
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}
