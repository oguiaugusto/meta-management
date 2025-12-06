import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AccountFormCard } from '@/shared/components/AccountFormCard';

const Register: React.FC = () => {
  const renderCardBody = () => (
    <form>
      <div className="flex flex-col gap-3">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type=""
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
          />
        </div>
      </div>
    </form>
  );

  const renderCardFooter = () => (
    <React.Fragment>
    <Button type="submit" variant="default" className="w-full">
        Sign up
      </Button>
      <p className="text-xs font-medium">
        <span>{ 'Already have an account? '}</span>
        <a href="/login" className="underline-offset-4 hover:underline">Sign in</a>
      </p>
    </React.Fragment>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <AccountFormCard
        title="Sign up for Meta Management"
        body={ renderCardBody() }
        footer={ renderCardFooter() }
      />
    </div>
  );
};

export { Register };
