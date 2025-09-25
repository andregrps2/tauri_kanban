import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <div className="max-w-md mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="p-4 border rounded-lg">
                <ThemeSwitcher />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
              <div className="p-4 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="Enter your API token"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
