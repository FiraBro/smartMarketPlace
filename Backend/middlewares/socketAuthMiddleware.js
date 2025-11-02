// middlewares/socketAuthMiddleware.js
export const protectSocket = (socket, next) => {
  console.log('🔐 Socket handshake session:', socket.request.session);
  
  // Get user from session (same as your HTTP routes)
  const user = socket.request.session?.user;
  
  if (!user || !user._id) {
    console.log('❌ Socket authentication failed: No user in session');
    return next(new Error("Authentication required: Please log in"));
  }

  // Attach user to socket
  socket.user = user;
  console.log(`✅ Socket authenticated for user: ${user.name} (${user._id})`);

  next();
};