import React from 'react';
import logo from '../../assets/logo.svg';
import { Button } from '@/components/ui/button';

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
      </div>
      <div className="border-b border-slate-300 w-full" />
    </header>
  );
};

export { Header };
