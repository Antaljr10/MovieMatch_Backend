import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "SUPER_SECRET_KEY_123";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

export function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "7d" }
  );
}
