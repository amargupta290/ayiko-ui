const validation = data => {
  let valid = true;
  data.map(input => {
    input.error = false;
    if (
      (input?.mandatory && input?.value === '') ||
      input?.value === null ||
      input?.value?.length === 0
    ) {
      input.error = true;
      input.errorText = `${input.label} is required.`;
      valid = false;
    }
    if (input?.value && input?.pattern && !input?.pattern.test(input.value)) {
      input.error = true;
      input.errorText = `Please enter valid ${input.label}`;
      valid = false;
    }
    return input;
  });
  data.valid = valid;
  return data;
};

const isEmpty = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      return true; // If object is empty, return true
    }
  }

  return false;
};

export default {
  validation,
  isEmpty,
};
