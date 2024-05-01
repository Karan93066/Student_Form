import React, { useState } from 'react';
import './form.css';
import { format } from 'date-fns'; 
function StudentInfoForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [residentialStreet1Address, setResidentialStreet1Address] = useState('');
    const [residentialStreet2Address, setResidentialStreet2Address] = useState('');
    const [sameAsResidential, setSameAsResidential] = useState(false);
    const [parmanentStreet1Address, setParmanentStreet1Address] = useState('');
    const [parmanentStreet2Address, setParmanentStreet2Address] = useState('');
    const [files, setFiles] = useState({
      document1: { name: '', type: 'image', file: null },
      document2: { name: '', type: 'image', file: null }
    });


    const handleFileChange = (e, field) => {
      const file = e.target.files[0];
      setFiles({ ...files, [field]: { ...files[field], file } });
    };
  
    const handleNameChange = (e, field) => {
      const name = e.target.value;
      setFiles({ ...files, [field]: { ...files[field], name } });
    };
  
    const handleTypeChange = (e, field) => {
      const type = e.target.value;
      setFiles({ ...files, [field]: { ...files[field], type } });
    };
    const handleSameAsResidentialChange = () => {
        setSameAsResidential(!sameAsResidential);
        if (!sameAsResidential) {
            setParmanentStreet1Address(residentialStreet1Address);
            setParmanentStreet2Address(residentialStreet2Address);
        } else {
            parmanentStreet1Address('');
            setParmanentStreet2Address('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted!');
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 18); // Calculate date 18 years ago
        const selectedDate = new Date(dateOfBirth);
        if (selectedDate > minAgeDate) {
            alert("You must be at least 18 years old to submit this form.");
            return;
        }
        const formattedDateOfBirth = format(new Date(dateOfBirth), 'yyyy-MM-dd');
        const studentInfo = {
            firstName,
            lastName,
            email,
             dateOfBirth: formattedDateOfBirth,
            residentialStreet1Address,
            residentialStreet2Address,
            parmanentStreet1Address: sameAsResidential ? residentialStreet1Address:parmanentStreet1Address,
            parmanentStreet2Address: sameAsResidential ? residentialStreet2Address:parmanentStreet2Address,
            
        };
        console.log(studentInfo);
            try {
                const response = await fetch('http://localhost:3000/students', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(studentInfo)
                });
          
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
          
                alert('Student data added successfully');
            // Reset form fields after successful submission
            setFirstName('');
            setLastName('');
            setEmail('');
            setDateOfBirth('');
            setParmanentStreet1Address('');
            setParmanentStreet2Address('');
            setResidentialStreet1Address('');
            setResidentialStreet2Address('');
            setSameAsResidential(false);
            setFiles({
              document1: { name: '', type: 'image', file: '' },
              document2: { name: '', type: 'image', file: '' }
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
                    <input type="text" id="firstName" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}  required/>
                </div>

                </div>
              
               <div className="row">
               <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required/>
                </div>
               </div>

                
               <div>
               <div className="residence"> 
                 <label htmlFor="residentialStreet1Address">Residential Address :</label>
              </div>
              <div className='row'>
              <div className="form-group">
                    <label htmlFor="residentialStreet1Address">Street 1 :</label>
                    <input type="text" id="residentialStreet1Address" name="residentialStreet1Address" value={residentialStreet1Address} onChange={(e) => setResidentialStreet1Address(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="residentialStreet2Address">Street 2 :</label>
                    <input type="text" id="residentialStreet2Address" name="residentialStreet2Address" value={residentialStreet2Address} onChange={(e) => setResidentialStreet2Address(e.target.value)}  required/>

                </div>
              </div>

               </div>

                <div className="form-group">
                    <input type="checkbox" id="sameAsResidential" name="sameAsResidential" checked={sameAsResidential} onChange={handleSameAsResidentialChange} required/>
                    <label htmlFor="sameAsResidential">Same as Residential Address</label>
                </div>

                {!sameAsResidential && (
                  <div>
                  <div className="residence"> 
                  <label htmlFor="ParmanentAddress">Parmanent Address:</label>
                 </div>
                 <div className='row'>
                 <div className="form-group">
                       <label htmlFor="residentialStreet1Address">Street 1 :</label>
                       <input type="text" id="parmanentStreet1Address" name="parmanentStreet1Address" value={parmanentStreet1Address} onChange={(e) => setParmanentStreet1Address(e.target.value)}  required/>
                   </div>
                   <div className="form-group">
                       <label htmlFor="residentialStreet2Address">Street 2 :</label>
                       <input type="text" id="parmanentStreet2Address" name="parmanentStreet2Address" value={parmanentStreet2Address} onChange={(e) => setParmanentStreet2Address(e.target.value)}  required/>   
                   </div>
                 </div>
   
                  </div>
                )}
           <div className="residence"> 
                 <label htmlFor="Document">Upload Documents:</label>
              </div>
    <div className='row form-group'>
    <div>
        <label>Name:</label>
        <input type="text" value={files.document1.name} onChange={(e) => handleNameChange(e, 'document1')} />
      </div>
      <div>
        <label>Type:</label>
        <select value={files.document1.type} onChange={(e) => handleTypeChange(e, 'document1')}>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <div>
        <label>Upload Document</label>
        <input type="file" onChange={(e) => handleFileChange(e, 'document1')} />
      </div>
    </div>
  <div className='row form-groups'>
  <div>
        <label> Name:</label>
        <input type="text" value={files.document2.name} onChange={(e) => handleNameChange(e, 'document2')} />
      </div>
      <div>
        <label>Type:</label>
        <select value={files.document2.type} onChange={(e) => handleTypeChange(e, 'document2')}>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <div>
        <label>Upload Document</label>
        <input type="file" onChange={(e) => handleFileChange(e, 'document2')} />
      </div>
  </div>
     
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default StudentInfoForm;

