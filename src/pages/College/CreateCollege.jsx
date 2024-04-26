import React, { useState } from 'react';
import { BACKEND_URL } from '../../Constants';
import { useSelector } from 'react-redux';

const CreateCollege = ({ isOpen, onClose, onCreate }) => {
    const currentUser = useSelector((state) => state.user?.currentUser);
  
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    city: '',
    state: '',
    totalStudents: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/college`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.data?.accessToken}`
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create college');
      }
      const data = await response.json();
      onCreate(data);
    } catch (error) {
      console.error('Error creating college:', error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4">Create New College</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold mb-1">Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full border-gray-300 rounded-md p-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="mobileNumber" className="block font-semibold mb-1">Mobile Number *</label>
            <input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className="w-full border-gray-300 rounded-md p-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-1">Email</label>
            <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block font-semibold mb-1">City</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="state" className="block font-semibold mb-1">State</label>
            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2" />
          </div>
          <div className="mb-4">
            <label htmlFor="totalStudents" className="block font-semibold mb-1">Total Students</label>
            <input type="text" id="totalStudents" name="totalStudents" value={formData.totalStudents} onChange={handleChange} className="w-full border-gray-300 rounded-md p-2" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md mr-2">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollege;
