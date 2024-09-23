import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get('https://serverside-muom.onrender.com/get/applicants')
      .then(response => {
        setApplicants(response.data);
      })
      .catch(error => {
        console.error('Error fetching applicants:', error);
      });
  }, []);
  
// Front
  const sendConfirmation = (email) => {
    axios.post('http://localhost:5000/send-confirmation', { email })
      .then(response => {
        alert(`Confirmed email sent to ${email}`);
      })
      .catch(error => {
        console.error('Error sending confirmation email:', error);
        alert('Failed to send confirmation');
      });
  };

  return (
    <div className='max-w-screen container mx-auto xl:px-24 px-4 ml-[400px]'>
      <h2 className='text-2xl font-semibold mb-4 Ml-[20px]'>Applicants List</h2>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2'>Email</th>
            <th className='border px-4 py-2'>Send Email</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(applicant => (
            <tr key={applicant._id}>
              <td className='border px-4 py-2'>{applicant.email}</td>
              <td className='border px-4 py-2'>
                {applicant.email && (
                  <button onClick={() => sendConfirmation(applicant.email)}>Send Email to Applicants</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsList;
