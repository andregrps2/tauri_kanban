'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as ClickUpService from '@/lib/clickup-service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ClickUpList {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState('');
  const [selectedListId, setSelectedListId] = useState('');
  const [lists, setLists] = useState<ClickUpList[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('clickup_api_token') || '';
    const savedListId = localStorage.getItem('clickup_list_id') || '';
    setApiToken(savedToken);
    setSelectedListId(savedListId);

    if (savedToken) {
      fetchLists(savedToken);
    }
  }, []);

  const fetchLists = async (token: string) => {
    if (!token) return;
    setIsLoadingLists(true);
    try {
      // We need to set the token in localStorage for the service to use it
      localStorage.setItem('clickup_api_token', token);
      const workspaces = await ClickUpService.getWorkspaces();
      if (workspaces && workspaces.length > 0) {
        // Using the first workspace for simplicity
        const fetchedLists = await ClickUpService.getLists(workspaces[0].id);
        setLists(fetchedLists);
      } else {
        setLists([]);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch ClickUp lists',
        description:
          'Please check your API token and ensure it has the correct permissions.',
      });
      setLists([]);
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    setApiToken(token);
  };

  const handleTokenSave = () => {
    localStorage.setItem('clickup_api_token', apiToken);
    toast({
      title: 'API Token Saved',
      description: 'Fetching your ClickUp lists with the new token...',
    });
    fetchLists(apiToken);
  };

  const handleListChange = (listId: string) => {
    setSelectedListId(listId);
    localStorage.setItem('clickup_list_id', listId);
    toast({
      title: 'List Selected',
      description: 'Your Kanban board will now show tasks from this list.',
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
                  <div className="flex gap-2">
                    <Input
                      id="api-token"
                      type="password"
                      placeholder="Enter your API token"
                      value={apiToken}
                      onChange={handleTokenChange}
                    />
                    <button
                      onClick={handleTokenSave}
                      className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm hover:bg-accent/90"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="list-id">List</Label>
                  <Select
                    value={selectedListId}
                    onValueChange={handleListChange}
                    disabled={isLoadingLists || !apiToken || lists.length === 0}
                  >
                    <SelectTrigger id="list-id">
                      <SelectValue placeholder={
                          isLoadingLists ? "Loading lists..." :
                          !apiToken ? "Enter API token first" :
                          "Select a list"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}