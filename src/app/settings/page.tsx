'use client';

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
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="p-4 border rounded-lg">
                <ThemeSwitcher />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                API Configuration
              </h2>
              <div className="p-4 border rounded-lg space-y-4 text-center">
                <p className="text-muted-foreground">
                  Your ClickUp API Token and List ID are configured in the{' '}
                  <code className="bg-muted px-2 py-1 rounded-md font-mono text-sm">
                    .env.local
                  </code>{' '}
                  file.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
