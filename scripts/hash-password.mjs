// Usage: npm run admin:hash -- "your password"
import crypto from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: npm run admin:hash -- "a password of at least 10 characters"');
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 64);
console.log(`\nADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}\n`);
console.log("AUTH_SECRET (random, keep private):");
console.log(crypto.randomBytes(32).toString("hex") + "\n");
