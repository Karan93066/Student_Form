const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
//   const upload = multer({ storage });
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

mongoose.connect("mongodb://127.0.0.1:27017/Student_Form")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Error While Connecting MongoDB:", err));
    
// Student schema
const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    dateOfBirth: Date,
    residentialStreet1Address: String,
    residentialStreet2Address: String,
    parmanentStreet1Address: String,
    parmanentStreet2Address: String,
    fileName1: String,
    fileName2: String,
    fileType1: String,
    fileType2: String,
    documents: [{
        filename: String, // Corrected field definition
       
    }]
});

const Student = mongoose.model('Student', studentSchema);

// Route to add student data
app.post('/students', upload.array('documents', 2), async (req, res) => {
    try {
        const { firstName, lastName, email, dateOfBirth, residentialStreet1Address, residentialStreet2Address, parmanentStreet1Address, parmanentStreet2Address,fileName1,fileName2,fileType1,fileType2  } = req.body;
        
        // Map uploaded files to required format
        const documents = req.files && Array.isArray(req.files) ? 
            req.files.map(file => ({
                filename: file.filename,
                type: file.mimetype.includes('pdf') ? 'pdf' : 'image',
                path: file.path
            })) :
            [];
          
        // Create new student instance
        const student = new Student({
            firstName,
            lastName,
            email,
            dateOfBirth,
            residentialStreet1Address,
            residentialStreet2Address,
            parmanentStreet1Address,
            parmanentStreet2Address,
            fileName1,
            fileName2,
            fileType1,
            fileType2,
            documents
        });
      
        // Save student data to the database
        await student.save();

        res.status(201).json({ message: 'Student data added successfully' });
    } catch (err) {
        console.error('Error while adding student data:', err);
        res.status(500).json({ error: 'An error occurred while adding student data', errorMessage: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
