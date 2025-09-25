'use client';

import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState('');
  const [listId, setListId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load saved credentials from localStorage on component mount
    const savedToken = localStorage.getItem('clickup_api_token');
    const savedListId = localStorage.getItem('clickup_list_id');
    if (savedToken) setApiToken(savedToken);
    if (savedListId) setListId(savedListId);
  }, []);

  const handleSaveCredentials = () => {
    localStorage.setItem('clickup_api_token', apiToken);
    localStorage.setItem('clickup_list_id', listId);
    toast({
      title: 'Credentials Saved',
      description: 'Your ClickUp API credentials have been saved locally.',
    });
  };

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
              <div className="p-4 border rounded-lg space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your ClickUp API credentials are stored securely in your
                  browser&apos;s local storage and are never exposed in the code.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="api-token">ClickUp API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Enter your ClickUp API token"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="list-id">ClickUp List ID</Label>
                  <Input
                    id="list-id"
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    placeholder="Enter the ID of your ClickUp list"
                  />
                </div>
                <Button onClick={handleSaveCredentials} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Save Credentials
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
