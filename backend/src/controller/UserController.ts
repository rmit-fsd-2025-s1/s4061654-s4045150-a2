import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { UserInformation } from "../entity/UserInformation";
import { genSaltSync, hashSync } from "bcrypt";
import { compareSync } from "bcrypt";

export class UserController {
  private userRepository = AppDataSource.getRepository(UserInformation);

  async all(request: Request, response: Response) {
    const users = await this.userRepository.find();

    return response.json(users);
  }

  async one(request: Request, response: Response) {
    const id = parseInt(request.params.userid);
    const user = await this.userRepository.findOne({
      where: { userid: id },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.json(user);
  }

  /**
   * Creates a new user in the database
   * @param request - Express request object containing user details in body
   * @param response - Express response object
   * @returns JSON response containing the created user or error message
   */
  async save(request: Request, response: Response) {
    const {
      userid,
      firstName,
      lastName,
      email,
      password,
      role,
      createdAt,
      about,
    } = request.body;

    const user = Object.assign(new UserInformation(), {
      userid,
      firstName,
      lastName,
      email,
      password,
      role,
      createdAt,
      about,
    });

    try {
      if (validateEmail(email)) {
        if (validatePassword(password)) {
          console.log("Valid password");
          const salt = genSaltSync(10);
          const hashedPassword = hashSync(password, salt);
          user.password = hashedPassword;
        } else {
          return response.status(400).json({
            message:
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
          });
        }
      } else {
        return response.status(400).json({
          message: "Please enter a valid email address.",
        });
      }
      const savedUser = await this.userRepository.save(user);
      return response.status(201).json(savedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating user", error });
    }
  }

  async remove(request: Request, response: Response) {
    const id = parseInt(request.params.userid);
    const userToRemove = await this.userRepository.findOne({
      where: { userid: id },
    });

    if (!userToRemove) {
      return response.status(404).json({ message: "User not found" });
    }

    await this.userRepository.remove(userToRemove);
    return response.json({ message: "User removed successfully" });
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid credentials provided" });
    }

    const passwordMatches = compareSync(password, user.password);
    if (!passwordMatches) {
      return response
        .status(401)
        .json({ message: "Invalid credentials provided" });
    }

    if (user.isBlocked) {
      return response
        .status(403)
        .json({ message: "User is blocked. Access denied." });
    }

    return response.json({
      userid: user.userid,
      firstName: user.firstName,
      role: user.role,
    });
  }

  async update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const updateFields = request.body;

    let userToUpdate = await this.userRepository.findOne({
      where: { userid: id },
    });

    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    // Only update fields that are present in the request body and exist on the entity
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] !== undefined && key in userToUpdate) {
        (userToUpdate as any)[key] = updateFields[key];
      }
    });

    try {
      const updatedUser = await this.userRepository.save(userToUpdate);
      return response.json(updatedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating user", error });
    }
  }
}

// Helper functions
const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
