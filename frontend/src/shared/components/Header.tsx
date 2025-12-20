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
import { useNavigate } from 'react-router';
import { ZINC_700 } from '../constants';
import { useAuthContext } from "@/modules/Auth/context/AuthContext";

const Header: React.FC = () => {
  const { logout } = useAuthContext();

  const navigate = useNavigate();

  const navButtons = [
    {
      label: 'Home',
      link: '/',
    },
    {
      label: 'Databases',
      link: '/databases',
    },
    {
      label: 'Docs',
      link: '/docs',
    },
    {
      label: 'Contact',
      link: '/contact',
    },
  ];

  const handleNavigate = (link: string) => {
    navigate(link)
  };

  return (
    <header className="w-full h-15 flex flex-col justify-between items-center bg-zinc-200">
      <div className="h-full flex justify-between items-center w-full px-10">
        <img src={ logo } alt="Meta Management logo" className="w-42" />
        <nav>
          <ul className="grid grid-cols-4">
            {
              navButtons.map((x) => (
                <li key={ `nav-${x.label}` } className="mx-auto">
                  <Button
                    variant="link"
                    className="text-zinc-800"
                    onClick={ () => handleNavigate(x.link) }
                  >
                    { x.label }
                  </Button>
                </li>
              ))
            }
          </ul>
        </nav>
        <div className="w-[168px] flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" title="My account">
              <UserRound size={ 30 } strokeWidth={ 1.5 } color={ ZINC_700 } />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-zinc-50" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <a href="/user" className="flex items-center gap-2 w-full">
                  <Settings size={ 10 } strokeWidth={ 1.5 } color={ ZINC_700 } />
                  <span className="mb-[1px]">Settings</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  className="m-0 p-0 border-none outline-none flex items-center gap-2 w-full cursor-pointer"
                  onClick={ logout }
                >
                  <LogOut size={ 10 } strokeWidth={ 1.5 } color={ ZINC_700 } />
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
