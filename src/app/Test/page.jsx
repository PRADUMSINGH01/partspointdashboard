// utils/generatePassword.js
import bcrypt from "bcryptjs";

/**
 * Generate a bcrypt-hashed password for storing in Firestore
 * @param {string} plainPassword - The raw password user provides
 * @returns {Promise<string>} - The hashed password
 */
export async function generatePasswordHash(plainPassword) {
  const saltRounds = 10; // cost factor
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

/**
 * Verify a plain password against a hashed password
 * @param {string} plainPassword - The raw password user provides
 * @param {string} hashedPassword - The bcrypt hashed password from DB
 * @returns {Promise<boolean>} - true if valid, false otherwise
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const page = () => {
  return <>Test</>;
};

export default page;
