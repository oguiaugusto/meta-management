import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { type PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  description?: string;
};

const PageCard: React.FC<Props> = (p) => {
  const renderCardHeader = () => {
    let titleClass = 'text-xl ';

    let description: React.ReactNode | null = (
      <CardDescription className="mb-1">{ p.description }</CardDescription>
    );

    if (p.description) {
      titleClass += 'text-left';
    } else {
      titleClass += 'text-center';
      description = null;
    }

    console.log(titleClass);

    return (
      <CardHeader>
        <div>
          <CardTitle className={ titleClass }>{ p.title }</CardTitle>
          { description }
        </div>
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
