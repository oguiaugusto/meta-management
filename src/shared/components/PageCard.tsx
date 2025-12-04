import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { type PropsWithChildren } from 'react';

type Props = PropsWithChildren & { title: string };

const PageCard: React.FC<Props> = (p) => {
  return (
    <Card className="w-4xl mt-8 bg-zinc-50 pb-10">
      <CardHeader>
        <CardTitle className="text-center text-xl">{ p.title }</CardTitle>
      </CardHeader>
      <CardContent>{ p.children }</CardContent>
    </Card>
  );
};

export { PageCard };
