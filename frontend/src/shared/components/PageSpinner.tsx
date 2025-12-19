import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const PageSpinner: React.FC = () => {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
      <Spinner className="size-16" strokeWidth={ .8 } />
    </div>
  );
};

export { PageSpinner };
