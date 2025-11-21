/**
 * Create a standardized session object for OAuth login
 */
export const createOAuthSession = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "buyer",
});
