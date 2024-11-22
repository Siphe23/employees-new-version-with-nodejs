// middleware.js

const admin = require('firebase-admin');

// Middleware to Check Super Admin Status
const isSuperAdmin = async (req, res, next) => {
  // Extract the token from the 'Authorization' header (format: Bearer <token>)
  const idToken = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required in the Authorization header' });
  }

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Set your super admin's UID here
    const superAdminUID = 'rNkvurYYqLZ2jvCrgFEoFVcMjTx2'; // Replace this with your super admin UID

    // Check if the user's UID matches the super admin UID
    if (uid !== superAdminUID) {
      return res.status(403).json({ message: 'Access denied: Not a super admin' });
    }

    // Attach the user data to the request object so other routes can access it
    req.user = { uid };
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(500).json({ message: 'Error verifying super admin status' });
  }
};

module.exports = { isSuperAdmin };
