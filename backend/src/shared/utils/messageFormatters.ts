const messageFormatters = {
  required: (field: string) => `"${field}" is required`,
  min: (field: string, val: number) => `"${field}" must be at least ${val} characters long`,
  max: (field: string, val: number) => `"${field}" cannot be more than ${val} characters long`,
  email: (field = 'Email') => `"${field}" must be a valid email`,
};

export { messageFormatters };
