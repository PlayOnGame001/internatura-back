import prisma from "../../../prisma/prisma.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(email: string, username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword },
  });

  return { id: user.id, email: user.email, username: user.username };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });

  return token;
}
export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, username: email.split('@')[0], password: hashedPassword } });
}
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

