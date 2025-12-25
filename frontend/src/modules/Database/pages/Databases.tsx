import React from 'react';
import { useNavigate } from "react-router";
import { Atom, Book, Car, Globe, House, Music2, Plus, ShoppingCart } from 'lucide-react';
import { ItemCard } from '@/shared/components/ItemCard';
import { ZINC_700 } from '@/shared/constants';
import { PageCard } from '@/shared/components/PageCard';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { useDatabaseForm } from "../hooks/useDatabaseForm";

const iconProps = {
  size: 50,
  strokeWidth: 1.5,
  color: ZINC_700,
};

/* Temporary data */
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
  const navigate = useNavigate();

  const dbForm = useDatabaseForm();

  return (
    <PageWrapper>
      { dbForm.render() }
      <PageCard title="Databases">
        <div className="grid grid-cols-5 gap-3">
          <ItemCard
            name="New Database"
            icon={ <Plus { ...iconProps } /> }
            action={ dbForm.open }
            isNewItem
          />
          {
            data.map((x, i) => (
              <ItemCard
                key={ i }
                name={ x.name }
                icon={ x.icon }
                action={ () => navigate(x.link) }
              />
            ))
          }
        </div>
      </PageCard>
    </PageWrapper>
  );
};

export { Databases };
