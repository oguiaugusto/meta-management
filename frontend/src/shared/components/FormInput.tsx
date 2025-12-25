import React, { HTMLInputTypeAttribute } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeHandler } from '../types/misc';
import { FieldTooltip } from "./FieldTooltip";

type Props = {
  type: HTMLInputTypeAttribute;
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  labelLink?: React.ReactNode;
  autoComplete?: React.HTMLInputAutoCompleteAttribute,
  tooltipText?: string,
  onChange: ChangeHandler;
};

const FormInput: React.FC<Props> = (p) => {
  const errorInputClass = 'border-ring ring-ring/50 ring-[3px] ring-red-200';
  const renderErrorMessage = () => (
    <p className="text-xs text-red-600 mt-[-2px]">
      { `"${p.label}" ${p.errorMessage}` }
    </p>
  );

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Label htmlFor={ p.name }>{ p.label }</Label>
          { p.tooltipText ? <FieldTooltip text={ p.tooltipText } /> : null }
        </div>
        { p.labelLink }
      </div>
      <Input
        type={ p.type }
        id={ p.name }
        name={ p.name }
        onChange={ p.onChange }
        required={ p.required }
        autoComplete={ p.autoComplete }
        className={ p.errorMessage ? errorInputClass : '' }
      />
      { p.errorMessage ? renderErrorMessage() : null }
    </div>
  );
};

export { FormInput };
