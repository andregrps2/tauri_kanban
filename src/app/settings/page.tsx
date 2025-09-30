'use client';

import AppLayout from '@/components/AppLayout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      ClickUp Integration
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AccordionTrigger>
                            <HelpCircle className="h-5 w-5" />
                          </AccordionTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How to get your credentials</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <AccordionContent>
                    <div className="space-y-4 p-2 border-t pt-4">
                      <h4 className="font-semibold">How to get your API Token:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Log in to your ClickUp account.</li>
                        <li>
                          Click your avatar in the bottom-left corner and select{' '}
                          <strong>My Settings</strong>.
                        </li>
                        <li>
                          In the left sidebar, click on <strong>Apps</strong>.
                        </li>
                        <li>
                          Under the <strong>API Token</strong> section, click{' '}
                          <strong>Generate</strong> to create a new token.
                        </li>
                        <li>Copy the generated token and paste it below.</li>
                      </ol>
                      <hr />
                      <h4 className="font-semibold">How to get your List ID:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>
                          Navigate to the specific List or Board view in ClickUp.
                        </li>
                        <li>
                          Look at the URL in your browser&apos;s address bar.
                        </li>
                        <li>
                          The URL will look like:{' '}
                          <code className="text-xs bg-muted p-1 rounded">
                            https://app.clickup.com/123456/v/li/
                            <strong>987654321</strong>
                          </code>
                        </li>
                        <li>
                          The long number at the very end is your{' '}
                          <strong>List ID</strong>. Copy and paste it below.
                        </li>
                      </ol>
                    </div>
                  </AccordionContent>

                  <div className="space-y-2 pt-4">
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
                  <Button
                    onClick={handleSaveCredentials}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Save Credentials
                  </Button>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
