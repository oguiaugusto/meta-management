import React from 'react';
import { LogOut, Settings, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  const navButtons = [
    {
      label: 'Home',
      link: '#',
    },
    {
      label: 'Tables',
      link: '#',
    },
    {
      label: 'Docs',
      link: '#',
    },
    {
      label: 'Contact',
      link: '#',
    },
  ];

  const iconColor = 'oklch(27.4% 0.006 286.033)';

  return (
    <header className="w-full h-15 flex flex-col justify-between items-center bg-zinc-200">
      <div className="h-full flex justify-between items-center w-full px-10">
        <img src={ logo } alt="Meta Management logo" className="w-42" />
        <nav>
          <ul className="grid grid-cols-4">
            {
              navButtons.map((x) => (
                <li key={ `nav-${x.label}` } className="mx-auto">
                  <Button variant="link" className="text-zinc-800 focus-visible:shadow-none">
                    { x.label }
                  </Button>
                </li>
              ))
            }
          </ul>
        </nav>
        <div className="w-[168px] flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer focus-visible:outline-none">
              <UserRound size={ 30 } strokeWidth={ 1.5 } color={ iconColor } />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-zinc-50" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <a href="/user" className="flex items-center gap-2 w-full">
                  <Settings size={ 10 } strokeWidth={ 1.5 } color={ iconColor } />
                  <span className="mb-[1px]">Settings</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="m-0 p-0 border-none outline-none flex items-center gap-2 w-full cursor-pointer">
                  <LogOut size={ 10 } strokeWidth={ 1.5 } color={ iconColor } />
                  <span className="mb-[1px]">Sign out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="border-b border-slate-300 w-full" />
    </header>
  );
};

export { Header };
