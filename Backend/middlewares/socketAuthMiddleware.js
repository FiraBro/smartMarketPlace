// Dev version: expects { userId } in socket.handshake.auth
export const protectSocket = (socket, next) => {
  const { userId, token } = socket.handshake.auth || {};

  if (!userId && !token) {
    return next(new Error("Authentication required"));
  }

  // Simple dev auth: attach userId
  socket.user = { _id: userId };

  // Optional: JWT verification examples
  // import jwt from 'jsonwebtoken';
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   socket.user = decoded;
  // } catch(err) { return next(new Error("Invalid token")); }

  next();
};
