// utils/auth.js
import bcrypt from 'bcryptjs'

/**
 * Generate a bcrypt hash for a plain-text password.
 * @param {string} password - Plain text password
 * @param {number} [saltRounds=12] - Work factor (10-12 is common; higher is stronger but slower)
 * @returns {Promise<string>} - bcrypt hash (store this in DB)
 */
export async function generatePasswordHash(password, saltRounds = 12) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string')
  }

  // Optionally enforce a minimum length
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }

  // Generate salt and hash
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

/**
 * Verify password against stored hash
 * @param {string} password - Plain text password to check
 * @param {string} storedHash - bcrypt hash from DB
 * @returns {Promise<boolean>}
 */

import AddProductModal from '@/components/AddProductButton'
export async function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false
  return await bcrypt.compare(password, storedHash)
}


 async function  Page() {

    const res = await fetch('http://localhost:3000/api/Products', { cache: 'no-store' }).then(res => res.json()   )
    console.log('Generated hash:', res)
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <AddProductModal />
    </div>
  )
}               


export default Page