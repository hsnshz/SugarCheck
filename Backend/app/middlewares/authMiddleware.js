import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: "Authentication header is missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    return res.status(403).json({ error: "Token is missing in the header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }

  return next();
};

export { authMiddleware };
