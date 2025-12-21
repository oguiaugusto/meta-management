import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { AccountFormCard } from '@/shared/components/AccountFormCard';
import { useAuthContext } from "../context/AuthContext";
import { useErrorAlert } from "@/shared/hooks/useErrorAlert";
import { mountFieldErrors } from "@/shared/utils/mountFieldErrors";
import { FormInput } from "@/shared/components/FormInput";
import { getHandleChange } from "@/shared/utils/handlers/getHandleChange";
import { handleApiError } from "@/shared/api/helpers/handleApiError";

const Register: React.FC = () => {
  const { register, accessToken } = useAuthContext();
  const [renderAlert, setAlertMessage] = useErrorAlert();

  const [fields, setFields] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState(mountFieldErrors(fields));

  const handleChange = getHandleChange(setFields, setFieldErrors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage('');

    const res = await register(fields);
    handleApiError(res, setFieldErrors, setAlertMessage);

    if (res.ok) {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 800)),
        {
          loading: (
            <div>
              <p className="font-bold">Account Created!</p>
              <p>Please sign in to get started.</p>
            </div>
          ),
          success: (
            <div>
              <p className="font-bold">Account Created!</p>
              <p>Redirecting to Sign In.</p>
            </div>
          ),
          className: 'success-toast'
        },
      ).unwrap().then(() => {
        setTimeout(() => {
          window.location.href = '/login';
        }, 400);
      });
    }
  };

  useEffect(() => {
    if (accessToken) {
      useNavigate()('/');
    }
  }, []);

  const renderCardBody = () => (
    <React.Fragment>
      { renderAlert() }
      <div className="flex flex-col gap-3">
        <FormInput
          type="text"
          name="name"
          label="Name"
          errorMessage={ fieldErrors.name }
          onChange={ handleChange }
          required
        />
        <FormInput
          type="text"
          name="username"
          label="Username"
          errorMessage={ fieldErrors.username }
          onChange={ handleChange }
          required
        />
        <FormInput
          type="email"
          name="email"
          label="Email"
          errorMessage={ fieldErrors.email }
          onChange={ handleChange }
          required
        />
        <FormInput
          type="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          errorMessage={ fieldErrors.password }
          onChange={ handleChange }
          required
        />
      </div>
    </React.Fragment>
  );

  const renderCardFooter = () => (
    <React.Fragment>
      <Button type="submit" variant="default" className="w-full">
        Sign up
      </Button>
      <p className="text-xs font-medium">
        <span>{ 'Already have an account? '}</span>
        <Link to="/login" className="underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </React.Fragment>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={ handleSubmit }>
        <AccountFormCard
          title="Sign up for Meta Management"
          body={ renderCardBody() }
          footer={ renderCardFooter() }
        />
      </form>
    </div>
  );
};

export { Register };
