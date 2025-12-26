import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormInput } from "@/shared/components/FormInput";
import { mountFieldErrors } from "@/shared/utils/mountFieldErrors";
import { getHandleChange } from "@/shared/utils/handlers/getHandleChange";
import { Button } from "@/components/ui/button";
import { IconSelector } from "@/shared/components/IconSelector";

const useDatabaseForm = () => {
  const [state, setState] = useState(false);

  const open = () => setState(true);
  const close = () => setState(false);

  const [fields, setFields] = useState({
    name: '',
    label: '',
    description: '',
    icon: '',
  });
  const [fieldErrors, setFieldErrors] = useState(mountFieldErrors(fields));

  const handleChange = getHandleChange(setFields, setFieldErrors);

  const render = () => (
    <form>
      <Dialog open={ state } onOpenChange={ setState }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Database</DialogTitle>
            <DialogDescription>Create a new database</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <FormInput
              type="text"
              name="name"
              label="Name"
              tooltipText="Database identifier. Must be unique and not contain spaces or special characters"
              errorMessage={ fieldErrors.name }
              onChange={ handleChange }
              required
            />
            <FormInput
              type="text"
              name="label"
              label="Label"
              tooltipText="Name that will be publicly displayed"
              errorMessage={ fieldErrors.label }
              onChange={ handleChange }
              required
            />
            <FormInput
              type="text"
              name="description"
              label="Description"
              errorMessage={ fieldErrors.description }
              onChange={ handleChange }
              required
            />
            <IconSelector
              name="icon"
              label="Display Icon"
              setValue={ (x) => setFields((p) => ({ ...p, icon: x })) }
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );

  return { open, close, render };
};

export { useDatabaseForm };
