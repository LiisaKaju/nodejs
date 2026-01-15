import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

// REGISTER
export const register = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    // lihtne kontroll
    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required",
      });
    }

    // kas selline kasutaja juba on?
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(400).json({
        message: "User already exists",
      });
    }

    // parooli hashimine
    const hashedPassword = await bcrypt.hash(password, 12);

    // uue kasutaja loomine
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return response.status(201).json({
      message: "User created successfully",
    });
  } catch (exception) {
    // lase error järgmisele middleware’ile
    next(exception);
  }
};

// LOGIN
export const login = async (request, response, next) => {
  
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({
        message: "Invalid credentials",
      });
    }

    // kontrolli, et sul on .env failis JWT_SECRET olemas
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return response.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (exception) {
    next(exception);
  }
};
