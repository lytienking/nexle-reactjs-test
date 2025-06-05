import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(18, 'Password must not exceed 18 characters')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/, 
      'Password must contain at least one digit, one special character, and one letter'),
});

export const getPasswordStrength = (password: string) => {
  if (!password) return '';
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'Password is weak';
  if (score === 2) return 'Password is fair';
  if (score === 3) return 'Password is good';
  if (score >= 4) return 'Password is strong';
  return '';
}

