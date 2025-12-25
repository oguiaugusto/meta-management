import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
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
  const navigate = useNavigate();

  const renderEditButton = () => (
    <Link to={ `/databases/edit/${id}` } title="Edit database" className="px-3">
      <Pencil size={ 20 } color={ ZINC_700 } />
    </Link>
  );

  return (
    <PageWrapper>
      <PageCard
        title={ data.name }
        description={ data.description }
        rightElement={ renderEditButton() }
        alignLeft
      >
        <div className="grid grid-cols-5 gap-3">
          <ItemCard
            name="New Table"
            icon={ <Plus { ...iconProps } /> }
            action={ () => {} }
            isNewItem
          />
          {
            data.tables.map((x, i) => (
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

export { Database };
