import React, { useEffect, useState } from 'react';
import { ChevronsUpDownIcon, icons as LucideIcons } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FieldTooltip } from "./FieldTooltip";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  tooltipText?: string,
  setValue: (x: string) => void;
};

const icons = Object.entries(LucideIcons);

const IconSelector: React.FC<Props> = (p) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const renderSelected = () => {
    const icon = icons.find(([name]) => name === value);

    if (icon) {
      const Icon = icon[1];

      return (
        <React.Fragment>
          <Icon />
          <span className="truncate">{ icon[0] }</span>
        </React.Fragment>
      )
    }

    return null;
  };

  useEffect(() => {
    let to: number | undefined;

    if (open && value) {
      to = setTimeout(() => {
        const el = document.getElementsByClassName('selected-icon');

        if (el.length) {
          el[0].scrollIntoView();
        }
      }, 100);
    }

    return () => clearTimeout(to);
  }, [open]);

  useEffect(() => {
    p.setValue(value);
  }, [value]);

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
      </div>
      <Popover open={ open } onOpenChange={ setOpen } modal>
        <PopoverTrigger asChild>
          <Button
            id={ p.name }
            name={ p.name }
            variant="outline"
            role="combobox"
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            {
              value ? (
                <span className="flex min-w-0 items-center gap-2">
                  { renderSelected() }
                </span>
              ) : (
                <span className="text-muted-foreground">Select icon</span>
              )
            }
            <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search industries..." />
            <CommandList>
              <CommandEmpty>No icon found.</CommandEmpty>
              <CommandGroup>
                {
                  icons.map(([name, Icon]) => (
                    <CommandItem
                      key={ name }
                      value={ name }
                      className={ `flex items-center justify-between ${value === name ? 'selected-icon bg-accent' : ''}` }
                      onSelect={
                        (x) => {
                          setValue((x) === value ? '' : (x))
                          setOpen(false)
                        }
                      }
                    >
                      <div className="flex items-center gap-2">
                        { <Icon className="text-muted-foreground size-4" /> }
                        { name }
                      </div>
                    </CommandItem>
                  ))
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      { p.errorMessage ? renderErrorMessage() : null }
    </div>
  );
};

export { IconSelector };
