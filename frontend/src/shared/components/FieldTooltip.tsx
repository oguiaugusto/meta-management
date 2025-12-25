import React from 'react';
import { CircleQuestionMark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ZINC_700 } from "../constants";

const FieldTooltip: React.FC<{ text: string }> = (p) => {
  return (
    <Tooltip>
      <TooltipTrigger className="bg-zinc-100" tabIndex={ -1 }>
        <CircleQuestionMark size={ 12 } color={ ZINC_700 } />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-wrap" align="start" alignOffset={ -16 }>
        { p.text }
      </TooltipContent>
    </Tooltip>
  );
};

export { FieldTooltip };
