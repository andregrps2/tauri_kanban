import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="py-4 px-6 border-b">
          <h1 className="text-2xl font-bold text-center font-headline text-foreground">
            Settings
          </h1>
        </header>
        <main className="flex-grow overflow-auto p-6">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <div className="p-4 border rounded-lg">
              <ThemeSwitcher />
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
