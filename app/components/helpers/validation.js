export const validateRequired = (value) => {
  return value.trim() !== '' ? null : 'Este campo es requerido';
};

export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Email inválido';
};

export const validateDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()) || value === '' ? null : 'Fecha inválida';
};

export const validateNumber = (value) => {
  return !isNaN(Number(value)) ? null : 'Debe ser un número';
};
