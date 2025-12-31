import User from "../models/User.mjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
