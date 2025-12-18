import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

const useErrorAlert = () => {
  const [message, setMessage] = useState<string | null>(null);

  const renderAlert = () => {
    if (message === null) return null;

    return (
      <Alert variant="default" className="mb-3 bg-red-400 flex items-center justify-between gap-2">
        <AlertDescription className="text-zinc-100">{ message }</AlertDescription>
        <button
          className="cursor-pointer text-zinc-100 focus-visible:outline-none hover:text-zinc-200"
          onClick={ () => setMessage(null) }
        >
          <X size={ 16 } />
        </button>
      </Alert>
    );
  };

  return [renderAlert, setMessage] as [typeof renderAlert, typeof setMessage];
};

export { useErrorAlert };
