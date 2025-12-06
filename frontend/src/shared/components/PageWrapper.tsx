import React, { type PropsWithChildren } from 'react';
import { Header } from './Header';

const PageWrapper: React.FC<PropsWithChildren> = (p) => {
  return (
    <div className="w-full flex flex-col items-center mb-10">
      <Header />
      { p.children }
    </div>
  );
};

export { PageWrapper };
