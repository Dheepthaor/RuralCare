import crypto from 'crypto';

export const generateAppointmentReference = () => {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `RC-${year}-${randomPart}`;
};
