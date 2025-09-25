export interface UserData {
  id: number;
  username: string;
  color: string;
  profilePicture: string | null;
}

export interface LabelData {
  id: string;
  name: string;
  color: string; // e.g., 'bg-red-500', 'bg-blue-500'
}

export interface CommentData {
  id: string;
  text: string;
  timestamp: string;
  user: UserData;
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

export interface AttachmentData {
    id: string;
    url: string;
    thumbnail_small?: string;
}

export interface CardData {
  id: string;
  title: string;
  description?: string;
  labels?: LabelData[];
  comments?: CommentData[];
  checklists?: ChecklistData[];
  statusId?: string; // To know which column it belongs to
  attachments?: AttachmentData[];
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}
