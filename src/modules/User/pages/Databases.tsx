import React from 'react';
import { Atom, Book, Car, Globe, House, Music2, Plus, ShoppingCart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/shared/components/Header';
import { ItemCard } from '@/shared/components/ItemCard';
import { ZINC_700 } from '@/shared/constants';

const iconProps = {
  size: 50,
  strokeWidth: 1.5,
  color: ZINC_700,
};

/* Temporary data
 */
const data = [
  { name: 'Book Store', link: '/databases/1', icon: <Book { ...iconProps } /> },
  { name: 'Social Media', link: '/databases/2', icon: <Globe { ...iconProps } /> },
  { name: 'House', link: '/databases/3', icon: <House { ...iconProps } /> },
  { name: 'Supermarket', link: '/databases/4', icon: <ShoppingCart { ...iconProps } /> },
  { name: 'Music', link: '/databases/5', icon: <Music2 { ...iconProps } /> },
  { name: 'Science Data', link: '/databases/6', icon: <Atom { ...iconProps } /> },
  { name: 'Car', link: '/databases/7', icon: <Car { ...iconProps } /> },
];

const Databases: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center mb-10">
      <Header />
      <Card className="w-4xl mt-8 bg-zinc-50 pb-10">
        <CardHeader>
          <CardTitle className="text-center text-xl">Databases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            <ItemCard
              name="New Database"
              link="/databases/new"
              icon={ <Plus { ...iconProps } /> }
              isNewItem
            />
            { data.map((x) => <ItemCard name={ x.name } link={ x.link } icon={ x.icon } />) }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Databases };
