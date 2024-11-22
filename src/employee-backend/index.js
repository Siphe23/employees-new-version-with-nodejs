const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceKeys.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com', // Ensure Firebase Storage bucket is set correctly
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Admin Role
app.post('/api/adminRoles', upload.single('image'), async (req, res) => {
  const { name, surname, age, idNumber, phoneNumber, email, password } = req.body;
  const image = req.file;

  if (!name || !surname || !age || !idNumber || !phoneNumber || !email || !password || !image) {
    return res.status(400).json({ message: 'All fields, including image, are required' });
  }

  try {
    // Save image to Firebase Storage
    const file = bucket.file(`admin-images/${image.originalname}`);
    await file.save(image.buffer, { contentType: image.mimetype });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    const newAdmin = {
      name,
      surname,
      age,
      idNumber,
      phoneNumber,
      email,
      password,
      image: imageUrl,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('adminRoles').add(newAdmin);
    res.status(201).json({ message: 'Admin role created successfully', id: docRef.id });
  } catch (error) {
    console.error('Error creating admin role:', error);
    res.status(500).json({ message: 'Error creating admin role' });
  }
});

// Get All Admin Roles
app.get('/api/adminRoles', async (req, res) => {
  try {
    const adminRolesSnapshot = await db.collection('adminRoles').get();
    const adminRoles = adminRolesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(adminRoles);
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    res.status(500).json({ message: 'Error fetching admin roles' });
  }
});

// Delete Admin Role
app.delete('/api/adminRoles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('adminRoles').doc(id).delete();
    res.status(200).json({ message: 'Admin role deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin role:', error);
    res.status(500).json({ message: 'Error deleting admin role' });
  }
});
// 1. Add Employee
app.post('/api/employee', async (req, res) => {
  const { name, email, phone, position, saId, photo } = req.body;
  if (!name || !email || !phone || !position || !saId || !photo) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!/^\d{13}$/.test(saId)) {
    return res.status(400).json({ message: 'Invalid South African ID' });
  }
  try {
    const employeeRef = db.collection('employees').doc();
    await employeeRef.set({ name, email, phone, position, saId, photo });
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee' });
  }
});
// Post a new employee
// POST route to handle adding a new employee
app.post('/api/employees', (req, res) => {
  const employeeData = req.body; // Assuming you're sending employee data in the body
  // Add employee to database (for example using a simple in-memory array or a real database)
  employees.push(employeeData); // Or use your DB method here
  res.status(201).json(employeeData); // Respond with the added employee
});


// Get All Employees
app.get('/api/employees', async (req, res) => {
  try {
    const snapshot = await db.collection('employees').get();
    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// 3. Update Employee
app.put('/api/employee/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, position, saId, photo } = req.body;
  if (!name || !email || !phone || !position || !saId || !photo) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!/^\d{13}$/.test(saId)) {
    return res.status(400).json({ message: 'Invalid South African ID' });
  }
  try {
    const employeeRef = db.collection('employees').doc(id);
    await employeeRef.update({ name, email, phone, position, saId, photo });
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee' });
  }
});
// 4. Delete Employee
app.delete('/api/employee/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employeeRef = db.collection('employees').doc(id);
    await employeeRef.delete();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee' });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
