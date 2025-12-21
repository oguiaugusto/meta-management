import React from 'react';
import { Link } from "react-router";
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type Props = {
  name: string;
  link: string;
  icon: React.ReactNode;
  isNewItem?: boolean;
};

const ItemCard: React.FC<Props> = (p) => {
  const cardClass = p.isNewItem ? 'bg-[none] border-dashed border-2' : '';
  return (
    <Link to={ p.link }>
      <Card
        className={ `w-40 h-40 grid grid-rows-[1fr_30px] border-zinc-700 shadow-xs hover:shadow-md ${cardClass}` }
        style={{ borderSpacing: 20 }}
      >
        <CardContent className="flex justify-center items-center">
          { p.icon }
        </CardContent>
        <CardFooter className="font-medium text-center justify-center text-zinc-700">
          { p.name }
        </CardFooter>
      </Card>
    </Link>
  );
};

export { ItemCard };
