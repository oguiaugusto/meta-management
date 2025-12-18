function mountFieldErrors(obj: Record<string, any>) {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, '']));
}

export { mountFieldErrors };
