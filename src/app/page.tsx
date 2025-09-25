import AppLayout from '@/components/AppLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="py-4 px-6 border-b">
          <h1 className="text-2xl font-bold text-center font-headline text-foreground">
            Tauri Kanban Board
          </h1>
        </header>
        <main className="flex-grow overflow-auto">
          <KanbanBoard />
        </main>
      </div>
    </AppLayout>
  );
}
