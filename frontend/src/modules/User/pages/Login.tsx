import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AccountFormCard } from '@/shared/components/AccountFormCard';
import { getHandleChange } from '@/shared/utils/handlers/getHandleChange';
import { useAuthContext } from '@/shared/contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuthContext();

  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials);
  };

  const renderCardBody = () => (
    <form>
      <div className="flex flex-col gap-3">
        <div className="grid gap-2">
          <Label htmlFor="username">Username or email address</Label>
          <Input
            id="username"
            name="username"
            onChange={ getHandleChange(setCredentials) }
            type="text"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/recover" className="text-xs mt-[3.5px] underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            onChange={ getHandleChange(setCredentials) }
            required
          />
        </div>
      </div>
    </form>
  );

  const renderCardFooter = () => (
    <React.Fragment>
      <Button type="submit" variant="default" className="w-full" onClick={ handleSubmit }>
        Sign in
      </Button>
      <p className="text-xs font-medium">
        <span>{ 'Don\'t have an account? '}</span>
        <a href="/register" className="underline-offset-4 hover:underline">Sign up</a>
      </p>
    </React.Fragment>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <AccountFormCard
        title="Sign in to Meta Management"
        body={ renderCardBody() }
        footer={ renderCardFooter() }
      />
    </div>
  );
};

export { Login };
