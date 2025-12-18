import { ZodError } from 'zod';

const zodErrorMap = (err: ZodError) => {
  const fields: Record<string, string> = {};

  for (const issue of err.issues) {
    const key = issue.path.join('.') || 'form';

    if (fields[key]) continue;

    switch (issue.code) {
      case 'invalid_type':
        fields[key] =
          issue.input === 'undefined'
            ? 'is required'
            : 'has an invalid value';
        break;

      case 'too_small':
        if (issue.origin === 'string') {
          fields[key] = `must be at least ${issue.minimum} characters long`;
        } else if (issue.origin === 'number') {
          fields[key] = `must be greater than or equal to ${issue.minimum}`;
        } else if (issue.origin === 'array') {
          fields[key] = `must contain at least ${issue.minimum} items`;
        } else {
          fields[key] = 'is too small';
        }
        break;

      case 'too_big':
        if (issue.origin === 'string') {
          fields[key] = `cannot be more than ${issue.maximum} characters long`;
        } else if (issue.origin === 'number') {
          fields[key] = `must be less than or equal to ${issue.maximum}`;
        } else if (issue.origin === 'array') {
          fields[key] = `must contain no more than ${issue.maximum} items`;
        } else {
          fields[key] = 'is too large';
        }
        break;

      case 'invalid_format':
        if (issue.format === 'email') {
          fields[key] = 'must be a valid email address';
        } else {
          fields[key] = 'has an invalid format';
        }
        break;

      case 'not_multiple_of':
        fields[key] = `must be a multiple of ${issue.divisor}`;
        break;

      case 'unrecognized_keys':
        fields[key] = 'contains unknown or unexpected fields';
        break;

      case 'invalid_union':
        fields[key] = 'has an invalid value';
        break;

      case 'invalid_key':
        fields[key] = 'has an invalid key';
        break;

      case 'invalid_element':
        fields[key] = 'contains an invalid value';
        break;

      case 'invalid_value':
        fields[key] = 'has an invalid value';
        break;

      case 'custom':
        fields[key] = issue.message || 'has an invalid value';
        break;

      default:
        fields[key] = 'has an invalid value';
    }
  }

  return fields;
};

export { zodErrorMap };
