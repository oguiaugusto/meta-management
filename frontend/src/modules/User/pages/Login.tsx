import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AccountFormCard } from '@/shared/components/AccountFormCard';
import { getHandleChange } from '@/shared/utils/handlers/getHandleChange';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useErrorAlert } from '@/shared/hooks/useErrorAlert';
import { FormInput } from '@/shared/components/FormInput';
import { mountFieldErrors } from '@/shared/utils/mountFieldErrors';

const Login: React.FC = () => {
  const { login } = useAuthContext();
  const [renderAlert, setAlertMessage] = useErrorAlert();

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState(mountFieldErrors(credentials));

  const handleChange = getHandleChange(setCredentials, setFieldErrors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setAlertMessage('');
    const res = await login(credentials);
    if (res) {
      if (res.error) setAlertMessage(res.error);
      if (res.fields) setFieldErrors(res.fields);
    }
  };

  const renderCardBody = () => (
    <form>
      { renderAlert() }
      <div className="flex flex-col gap-3">
        <FormInput
          type="text"
          name="username"
          label="Username or email address"
          errorMessage={ fieldErrors.username }
          onChange={ handleChange }
          required
        />
        <FormInput
          type="password"
          name="password"
          label="Password"
          errorMessage={ fieldErrors.password }
          onChange={ handleChange }
          required
          labelLink={(
            <a href="/recover" className="text-xs mt-[3.5px] underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          )}
        />
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
