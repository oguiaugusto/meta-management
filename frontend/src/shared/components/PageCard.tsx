import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { type PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  alignLeft?: boolean;
};

const PageCard: React.FC<Props> = (p) => {
  const renderCardHeader = () => {
    let headerClass = '';
    let textAlignment = 'text-center';

    let description = p.description ? (
      <CardDescription className={ `mb-1 ${textAlignment}` }>
        { p.description }
      </CardDescription>
    ) : null;

    let rightElement: React.ReactNode | null = null;

    if (p.alignLeft) {
      textAlignment = 'text-left';
      headerClass = 'flex flex-items items-center  ';

      if (p.rightElement) {
        rightElement = p.rightElement;
        headerClass += 'justify-between';
      } else {
        headerClass += 'justify-start';
      }
    }

    return (
      <CardHeader className={ headerClass }>
        <div>
          <CardTitle className={ `text-xl mb-[-2px] ${textAlignment}` }>
            { p.title }
          </CardTitle>
          { description }
        </div>
        { rightElement }
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
