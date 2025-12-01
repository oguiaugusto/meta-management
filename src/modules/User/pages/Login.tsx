import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import logo from '../../../assets/logo.png';

const Login: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-100 max-w-xs mt-20">
        <CardHeader>
          <CardTitle className="text-center flex flex-col items-center gap-3">
            <img src={ logo } alt="Meta Management logo" className="w-35 mb-2" />
            <span className="text-lg">Sign in to Meta Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="username">Username or email address</Label>
                <Input
                  id="username"
                  type="text"
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
        </CardContent>
        <CardFooter className="flex flex-col gap-2 mt-2">
          <Button type="submit" variant="default" className="w-full">
            Sign in
          </Button>
          <p className="text-xs font-medium">
            <span>{ 'Don\'t have an account? '}</span>
            <a href="/register" className="underline-offset-4 hover:underline">Sign Up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export { Login };
