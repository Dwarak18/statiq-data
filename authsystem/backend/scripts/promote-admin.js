/**
 * Usage: node scripts/promote-admin.js user@example.com
 * Promotes an existing user to the 'admin' role. Run this once to bootstrap
 * your first admin account after they've signed up normally.
 */
require('dotenv').config();
const userRepository = require('../src/models/userRepository');
const pool = require('../src/db/pool');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/promote-admin.js <email>');
    process.exit(1);
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    console.error(`No user found with email ${email}. They must sign up first.`);
    process.exit(1);
  }

  const updated = await userRepository.setRole(user.id, 'admin');
  console.log(`Promoted ${email} (id: ${updated.id}) to admin.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
