'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza um placeholder ou nada até que o componente esteja montado no cliente
    return null;
  }

  return (
    <div className="space-y-4">
      <Label>Theme</Label>
      <RadioGroup
        value={theme}
        onValueChange={setTheme}
        className="grid max-w-md grid-cols-2 gap-8 pt-2"
      >
        <Label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="light" className="sr-only" />
          <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
              <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            Light
          </span>
        </Label>
        <Label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="dark" className="sr-only" />
          <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
              <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-slate-400" />
                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            Dark
          </span>
        </Label>
        <Label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="cyberpunk" className="sr-only" />
          <div className="items-center rounded-md border-2 border-muted bg-[#1a1f33] p-1 hover:border-accent hover:text-accent-foreground">
            <div className="space-y-2 rounded-sm bg-[#0e1222] p-2">
              <div className="space-y-2 rounded-md bg-[#1f2448] p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-[#ff00ff]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#00ffff]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-[#1f2448] p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#00ffff]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#00ffff]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-[#1f2448] p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#ff00ff]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#ff00ff]" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            Cyberpunk
          </span>
        </Label>
        <Label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="lofi-september" className="sr-only" />
          <div className="items-center rounded-md border-2 border-muted bg-[#f5f1e_] p-1 hover:border-accent hover:text-accent-foreground">
            <div className="space-y-2 rounded-sm bg-[#e9e1d_] p-2">
              <div className="space-y-2 rounded-md bg-[#fdfaf6] p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-[#d9a075]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#a69a8d]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-[#fdfaf6] p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#8c9c8e]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#a69a8d]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-[#fdfaf6] p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#d9a075]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#8c9c8e]" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            Lofi September
          </span>
        </Label>
        <Label className="[&:has([data-state=checked])>div]:border-primary">
          <RadioGroupItem value="lofi-dark-japanese" className="sr-only" />
          <div className="items-center rounded-md border-2 border-muted bg-[#1e1e2e] p-1 hover:border-accent hover:text-accent-foreground">
            <div className="space-y-2 rounded-sm bg-[#11111b] p-2">
              <div className="space-y-2 rounded-md bg-[#28283d] p-2 shadow-sm">
                <div className="h-2 w-[80px] rounded-lg bg-[#c9a7e6]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#f5c2e7]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-[#28283d] p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#c9a7e6]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#f5c2e7]" />
              </div>
              <div className="flex items-center space-x-2 rounded-md bg-[#28283d] p-2 shadow-sm">
                <div className="h-4 w-4 rounded-full bg-[#f5c2e7]" />
                <div className="h-2 w-[100px] rounded-lg bg-[#c9a7e6]" />
              </div>
            </div>
          </div>
          <span className="block w-full p-2 text-center font-normal">
            Lofi Dark Japanese
          </span>
        </Label>
      </RadioGroup>
    </div>
  );
}
