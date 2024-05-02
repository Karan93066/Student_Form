
import React, { useState } from 'react';
import './form.css';
import { format } from 'date-fns'; 

function StudentInfoForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        residentialStreet1Address: '',
        residentialStreet2Address: '',
        parmanentStreet1Address: '',
        parmanentStreet2Address: '',
        sameAsResidential: false,
        fileName1:'',
        fileName2:'',
        fileType1:'',
        fileType2:'',
        files: {
          document1: {  file: null },
          document2: {  file: null }
      }
    });

    const handleChange = (e, field) => {
        const value = e.target.value;
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

  const handleFileChange = (e, field) => {
      const files = e.target.files;
      if (files && files.length > 0) {
          const file = files[0];
          setFormData(prevState => ({
              ...prevState,
              files: {
                  ...prevState.files,
                  [field]: { ...prevState.files[field], file }
              }
          }));
      }
  };

    const handleSameAsResidentialChange = () => {
        setFormData(prevState => ({
            ...prevState,
            sameAsResidential: !prevState.sameAsResidential,
            parmanentStreet1Address: prevState.sameAsResidential ? '' : prevState.residentialStreet1Address,
            parmanentStreet2Address: prevState.sameAsResidential ? '' : prevState.residentialStreet2Address
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // Perform any validation if needed
  
          // Example: Check if the user is at least 18 years old
          const minAgeDate = new Date();
          minAgeDate.setFullYear(minAgeDate.getFullYear() - 18); 
          const selectedDate = new Date(formData.dateOfBirth);
          if (selectedDate > minAgeDate) {
              alert("You must be at least 18 years old to submit this form.");
              return;
          }
  
          // Prepare the student info object
          const formattedDateOfBirth = format(new Date(formData.dateOfBirth), 'yyyy-MM-dd');
          const studentInfo = {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              dateOfBirth: formattedDateOfBirth,
              residentialStreet1Address: formData.residentialStreet1Address,
              residentialStreet2Address: formData.residentialStreet2Address,
              parmanentStreet1Address: formData.sameAsResidential ? formData.residentialStreet1Address : formData.parmanentStreet1Address,
              parmanentStreet2Address: formData.sameAsResidential ? formData.residentialStreet2Address : formData.parmanentStreet2Address,
              fileName1:formData.fileName1,
              fileName2:formData.fileName2,
              fileType1:formData.fileType1,
              fileType2:formData.fileType2,
              // Add more fields if necessary
          };
  // Create FormData object
  const formDataToSend = new FormData();
        
  // Append each field to formDataToSend
  for (let key in studentInfo) {
      formDataToSend.append(key, studentInfo[key]);
  }
  
  // Append files
  formDataToSend.append('documents', formData.files.document1.file);
  formDataToSend.append('documents', formData.files.document2.file);
  

           console.log(formDataToSend);
            // Perform the HTTP POST request to submit the form data
        const response = await fetch('http://localhost:3000/students', {
            method: 'POST',
            body: formDataToSend
        });
  
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
  
          // Show success message
          alert('Student data added successfully');
  
          // Reset form fields after successful submission
          setFormData({
              firstName: '',
              lastName: '',
              email: '',
              dateOfBirth: '',
              residentialStreet1Address: '',
              residentialStreet2Address: '',
              parmanentStreet1Address: '',
              parmanentStreet2Address: '',
              sameAsResidential: false,
              fileName1:'',
              fileName2:'',
              fileType1:'',
              fileType2:'',
              files: {
                  document1: { file: '' },
                  document2: { file: '' }
              }
          });
  
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while adding student data');
      }
  };
  

    return (
        <div className="form-container">
            <h2>Student Information Form</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={(e) => handleChange(e, 'firstName')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={(e) => handleChange(e, 'lastName')} required />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={(e) => handleChange(e, 'email')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth:</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={(e) => handleChange(e, 'dateOfBirth')} required />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="residentialStreet1Address">Residential Street 1:</label>
                        <input type="text" id="residentialStreet1Address" name="residentialStreet1Address" value={formData.residentialStreet1Address} onChange={(e) => handleChange(e, 'residentialStreet1Address')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="residentialStreet2Address">Residential Street 2:</label>
                        <input type="text" id="residentialStreet2Address" name="residentialStreet2Address" value={formData.residentialStreet2Address} onChange={(e) => handleChange(e, 'residentialStreet2Address')} required />
                    </div>
                </div>
                <div className="form-group">
                    <input type="checkbox" id="sameAsResidential" name="sameAsResidential" checked={formData.sameAsResidential} onChange={handleSameAsResidentialChange} />
                    <label htmlFor="sameAsResidential">Same as Residential Address</label>
                </div>
                {!formData.sameAsResidential && (
                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="parmanentStreet1Address">Permanent Street 1:</label>
                            <input type="text" id="parmanentStreet1Address" name="parmanentStreet1Address" value={formData.parmanentStreet1Address} onChange={(e) => handleChange(e, 'parmanentStreet1Address')} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parmanentStreet2Address">Permanent Street 2:</label>
                            <input type="text" id="parmanentStreet2Address" name="parmanentStreet2Address" value={formData.parmanentStreet2Address} onChange={(e) => handleChange(e, 'parmanentStreet2Address')} required />
                        </div>
                    </div>
                )}
              <div className="row">
                    <div className="form-group">
                        <label htmlFor="document1Name">Document 1 Name:</label>
                        <input type="text" id="document1Name" name="document1Name" value={formData.fileName1} onChange={(e) => handleChange(e, 'fileName1')} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="document1Type">Document 1 Type:</label>
                        <select id="document1Type" name="document1Type" value={formData.fileType1} onChange={(e) => handleChange(e, 'fileType1')} required>
                            <option value="image">Image</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="document1File">Document 1 File:</label>
                        <input type="file" id="document1File" name="document1File" onChange={(e) => handleFileChange(e, 'document1')} required/>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="fileName2">Document 2 Name:</label>
                        <input type="text" id="fileName2" name="fileName2" value={formData.fileName2} onChange={(e) => handleChange(e, 'fileName2')} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fileType2">Document 2 Type:</label>
                        <select id="fileType2" name="fileType2" value={formData.fileType2}  onChange={(e) => handleChange(e, 'fileType2')} required>
                            <option value="image">Image</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="document2File">Document 2 File:</label>
                        <input type="file" id="document2File" name="document2File" onChange={(e) => handleFileChange(e, 'document2')} required/>
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default StudentInfoForm;
