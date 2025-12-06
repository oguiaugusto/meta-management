import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '../../assets/icon.svg';

type Props = {
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
};

const AccountFormCard: React.FC<Props> = (p) => {
  return (
  <Card className="w-100 max-w-xs mt-20">
    <CardHeader>
      <CardTitle className="text-center flex flex-col items-center gap-1">
        <img src={ logo } alt="Meta Management logo" className="w-10" />
        <span className="text-lg">{ p.title }</span>
      </CardTitle>
    </CardHeader>
    <CardContent>{ p.body }</CardContent>
    <CardFooter className="flex flex-col gap-2 mt-2">{ p.footer }</CardFooter>
  </Card>
  );
};

export { AccountFormCard };
