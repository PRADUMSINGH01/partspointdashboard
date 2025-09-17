// utils/generatePassword.js
import bcrypt from "bcryptjs";

/**
 * Generate a bcrypt-hashed password for storing in Firestore
 * @param {string} plainPassword - The raw password user provides
 * @returns {Promise<string>} - The hashed password
 */
export async function generatePasswordHash(plainPassword) {
  const saltRounds = 10; // adjust cost factor if needed
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

async function Page() {
  const res = generatePasswordHash("chandan@123");

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page. {res}</p>
    </div>
  );
}

export default Page;
