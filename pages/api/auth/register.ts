import { NextApiRequest, NextApiResponse } from 'next'  
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    })
    
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
} 