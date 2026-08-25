import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { config } from "../../config";
import { AppError } from "../../middleware/errorHandler";
import { RegisterDto, LoginDto, AuthResponse, UserResponse } from "./auth.types";

function generateToken(user: { id: number; email: string; role: string }): string {
  const sevenDays = 7 * 24 * 60 * 60;
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: sevenDays }
  );
}

function toUserResponse(user: any): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
}

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const { name, email, password } = dto;

  if (!name || !email || !password) {
    throw new AppError(400, "Все поля обязательны");
  }

  if (password.length < 6) {
    throw new AppError(400, "Пароль должен быть минимум 6 символов");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(400, "Невалидный email");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, "Email уже зарегистрирован");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true },
  });

  const token = generateToken(user);
  return { user: toUserResponse(user), token };
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { email, password } = dto;

  if (!email || !password) {
    throw new AppError(400, "Email и пароль обязательны");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Неверный email или пароль");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError(401, "Неверный email или пароль");
  }

  const token = generateToken(user);
  return { user: toUserResponse(user), token };
}

export async function getMe(userId: number): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });

  if (!user) {
    throw new AppError(401, "Пользователь не найден");
  }

  return toUserResponse(user);
}
