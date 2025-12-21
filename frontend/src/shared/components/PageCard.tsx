import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { type PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  description?: string;
  rightNode?: React.ReactNode;
};

const PageCard: React.FC<Props> = (p) => {
  const renderCardHeader = () => {
    let headerClass = '';
    let titleClass = 'text-xl ';

    let description: React.ReactNode | null = (
      <CardDescription className="mb-1">{ p.description }</CardDescription>
    );

    let rightNode: React.ReactNode | null = null;

    if (p.description) {
      titleClass += 'text-left';

      if (p.rightNode) {
        rightNode = p.rightNode;
        headerClass = 'flex items-center justify-between';
      }
    } else {
      titleClass += 'text-center';
      description = null;
    }

    return (
      <CardHeader className={ headerClass }>
        <div>
          <CardTitle className={ titleClass }>{ p.title }</CardTitle>
          { description }
        </div>
        { rightNode }
      </CardHeader>
    );
  };

  return (
    <Card className="w-4xl mt-8 bg-zinc-50 pb-10">
      { renderCardHeader() }
      <CardContent>{ p.children }</CardContent>
    </Card>
  );
};

export { PageCard };
