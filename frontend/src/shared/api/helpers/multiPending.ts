import { UseMutationResult } from '@tanstack/react-query';

function multiPending(...mutations: UseMutationResult<any, any, any, any>[]) {
  return mutations.some((x) => x.isPending);
}

export { multiPending };
