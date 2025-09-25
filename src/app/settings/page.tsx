'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState('');
  const [listId, setListId] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage when the component mounts
    const savedToken = localStorage.getItem('clickup_api_token');
    const savedListId = localStorage.getItem('clickup_list_id');
    if (savedToken) {
      setApiToken(savedToken);
    }
    if (savedListId) {
      setListId(savedListId);
    }
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    setApiToken(token);
    // Save the token to localStorage
    localStorage.setItem('clickup_api_token', token);
  };
  
  const handleListIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setListId(id);
    localStorage.setItem('clickup_list_id', id);
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
          <div className="max-w-md mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="p-4 border rounded-lg">
                <ThemeSwitcher />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">ClickUp API Configuration</h2>
              <div className="p-4 border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="Enter your API token"
                    value={apiToken}
                    onChange={handleTokenChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="list-id">List ID</Label>
                  <Input
                    id="list-id"
                    type="text"
                    placeholder="Enter the ClickUp List ID"
                    value={listId}
                    onChange={handleListIdChange}
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
