import React from 'react';
import { useParams } from 'react-router';
import { BookCopy, Pencil, Plus, User } from 'lucide-react';
import { ItemCard } from '@/shared/components/ItemCard';
import { PageCard } from '@/shared/components/PageCard';
import { PageWrapper } from '@/shared/components/PageWrapper';
import { ZINC_700 } from '@/shared/constants';

const iconProps = {
  size: 50,
  strokeWidth: 1.5,
  color: ZINC_700,
};

/* Temporary data */
const data = {
  name: 'Book Store',
  description: 'Tables of a book store',
  tables: [
    { name: 'Authors', link: '/databases/1/tables/1', icon: <User { ...iconProps } /> },
    { name: 'Books', link: '/databases/1/tables/2', icon: <BookCopy { ...iconProps } /> },
  ],
};

const Database: React.FC = () => {
  const { id } = useParams();

  const renderEditButton = () => (
    <a href={ `/databases/edit/${id}` } title="Edit database" className="px-3">
      <Pencil size={ 20 } color={ ZINC_700 } />
    </a>
  );

  return (
    <PageWrapper>
      <PageCard
        title={ data.name }
        description={ data.description }
        rightNode={ renderEditButton() }
      >
        <div className="grid grid-cols-5 gap-3">
          <ItemCard
            name="New Table"
            link="/tables/new"
            icon={ <Plus { ...iconProps } /> }
            isNewItem
          />
          {
            data.tables.map((x, i) => (
              <ItemCard key={ i } name={ x.name } link={ x.link } icon={ x.icon } />
            ))
          }
        </div>
      </PageCard>
    </PageWrapper>
  );
};

export { Database };
