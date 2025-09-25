'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState('');
  const [listId, setListId] = useState('');
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('clickup_api_token') || '';
    const savedListId = localStorage.getItem('clickup_list_id') || '';
    setApiToken(savedToken);
    setListId(savedListId);
    setMounted(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('clickup_api_token', apiToken);
    localStorage.setItem('clickup_list_id', listId);
    toast({
      title: 'Settings Saved',
      description: 'Your ClickUp API token and List ID have been saved.',
    });
  };
  
  if (!mounted) {
    return null; // or a loading skeleton
  }

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
              <h2 className="text-xl font-semibold mb-4">
                ClickUp API Configuration
              </h2>
              <div className="p-4 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="Enter your API token"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="list-id">List ID</Label>
                   <Input
                    id="list-id"
                    type="text"
                    placeholder="Enter your ClickUp List ID"
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
