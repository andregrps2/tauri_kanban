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

interface ClickUpItem {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const [apiToken, setApiToken] = useState('');
  
  const [teams, setTeams] = useState<ClickUpItem[]>([]);
  const [spaces, setSpaces] = useState<ClickUpItem[]>([]);
  const [lists, setLists] = useState<ClickUpItem[]>([]);

  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [selectedListId, setSelectedListId] = useState('');

  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('clickup_api_token') || '';
    const savedTeamId = localStorage.getItem('clickup_team_id') || '';
    const savedSpaceId = localStorage.getItem('clickup_space_id') || '';
    const savedListId = localStorage.getItem('clickup_list_id') || '';
    
    setApiToken(savedToken);
    setSelectedTeamId(savedTeamId);
    setSelectedSpaceId(savedSpaceId);
    setSelectedListId(savedListId);

    if (savedToken) {
      fetchTeams(savedToken);
      if (savedTeamId) {
        fetchSpaces(savedTeamId);
      }
      if (savedSpaceId) {
        fetchLists(savedSpaceId);
      }
    }
  }, []);

  const fetchTeams = async (token: string) => {
    if (!token) return;
    setIsLoadingTeams(true);
    try {
      localStorage.setItem('clickup_api_token', token);
      const fetchedTeams = await ClickUpService.getWorkspaces();
      setTeams(fetchedTeams || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch ClickUp teams',
        description: 'Please check your API token and permissions.',
      });
      setTeams([]);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const fetchSpaces = async (teamId: string) => {
    if (!teamId) return;
    setIsLoadingSpaces(true);
    setLists([]);
    setSelectedListId('');
    localStorage.removeItem('clickup_list_id');
    try {
      const fetchedSpaces = await ClickUpService.getSpaces(teamId);
      setSpaces(fetchedSpaces || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch spaces',
        description: error.message,
      });
      setSpaces([]);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const fetchLists = async (spaceId: string) => {
    if (!spaceId) return;
    setIsLoadingLists(true);
    try {
      const fetchedLists = await ClickUpService.getLists(spaceId);
      setLists(fetchedLists || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch lists',
        description: error.message,
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
      description: 'Fetching your ClickUp teams...',
    });
    // Reset selections
    setSelectedTeamId('');
    setSelectedSpaceId('');
    setSelectedListId('');
    setSpaces([]);
    setLists([]);
    fetchTeams(apiToken);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    localStorage.setItem('clickup_team_id', teamId);
    // Reset subsequent selections
    setSelectedSpaceId('');
    setSelectedListId('');
    setSpaces([]);
    setLists([]);
    localStorage.removeItem('clickup_space_id');
    localStorage.removeItem('clickup_list_id');
    fetchSpaces(teamId);
  };

  const handleSpaceChange = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    localStorage.setItem('clickup_space_id', spaceId);
     // Reset subsequent selections
    setSelectedListId('');
    setLists([]);
    localStorage.removeItem('clickup_list_id');
    fetchLists(spaceId);
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
                  <Label htmlFor="team-select">Team (Workspace)</Label>
                  <Select
                    value={selectedTeamId}
                    onValueChange={handleTeamChange}
                    disabled={isLoadingTeams || !apiToken}
                  >
                    <SelectTrigger id="team-select">
                      <SelectValue placeholder={
                          isLoadingTeams ? "Loading teams..." :
                          !apiToken ? "Enter API token first" :
                          teams.length === 0 ? "No teams found" :
                          "Select a team"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="space-select">Space</Label>
                  <Select
                    value={selectedSpaceId}
                    onValueChange={handleSpaceChange}
                    disabled={isLoadingSpaces || !selectedTeamId}
                  >
                    <SelectTrigger id="space-select">
                      <SelectValue placeholder={
                          isLoadingSpaces ? "Loading spaces..." :
                          !selectedTeamId ? "Select a team first" :
                          spaces.length === 0 ? "No spaces found" :
                          "Select a space"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                      {spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="list-select">List</Label>
                  <Select
                    value={selectedListId}
                    onValueChange={handleListChange}
                    disabled={isLoadingLists || !selectedSpaceId}
                  >
                    <SelectTrigger id="list-select">
                      <SelectValue placeholder={
                          isLoadingLists ? "Loading lists..." :
                          !selectedSpaceId ? "Select a space first" :
                          lists.length === 0 ? "No lists found" :
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
