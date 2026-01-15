import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import ExistingEntityError from "../utils/ExistingEntityError.js";
import AuthenticationError from "../utils/AuthenticationError.js";

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

    if (existingUser) throw new ExistingEntityError("Incorrect credentials");
    

    // parooli hashimine
    const hashedPassword = await bcrypt.hash(password, 12);

    // uue kasutaja loomine
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    response.status(201);

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

    if (!isPasswordValid) throw new AuthenticationError("invalid credentials");
    

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
