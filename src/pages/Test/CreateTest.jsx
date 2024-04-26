import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../Constants';
import { useNavigate } from 'react-router-dom';
import { deleteUserSuccess } from '../../redux/user/userSlice';

function CreateTestForm() {
const navigate = useNavigate();
const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const [loading , setLoading] = useState(false);
  const [formData, setFormData] = useState({
    testName: '',
    testType: 'jee-mains',
    testYear: '',
    testDuration: '180',
    totalQuestions: '90'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const res = await fetch(
        `${BACKEND_URL}/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser?.data?.accessToken}`
        },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.statusCode === 407){
            //jwt token expired so we will signout the user 
            toast.error("Session Expired Please Login Again")
            dispatch(deleteUserSuccess(data));
        }
    
        if (data.success === false) {
          setLoading(false);
          toast.error("Failed to create new Test");
          return;
        }
        setLoading(false);
        toast.success("New Test created successfully");
        navigate('/test');
      } catch (error) {
        console.log(error)
        setLoading(false);
        toast.error("Failed to create new Test");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="testName" className="block text-sm font-medium text-gray-700">Test Name</label>
          <input id="testName" name="testName" type="text" value={formData.testName} onChange={handleChange} required maxLength="100" className="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="testType" className="block text-sm font-medium text-gray-700">Test Type</label>
          <select id="testType" name="testType" value={formData.testType} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="jee-mains">JEE Mains</option>
            {/* <option value="neet">NEET</option>
            <option value="afmc">AFMC</option> */}
          </select>
        </div>
        <div>
          <label htmlFor="testYear" className="block text-sm font-medium text-gray-700">Test Year</label>
          <input id="testYear" name="testYear" type="number" value={formData.testYear} onChange={handleChange} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="testDuration" className="block text-sm font-medium text-gray-700">Test Duration (in minutes)</label>
          <input id="testDuration" name="testDuration" type="number" value={formData.testDuration} onChange={handleChange} required className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="totalQuestions" className="block text-sm font-medium text-gray-700">Total Questions (1-300)</label>
          <input id="totalQuestions" name="totalQuestions" type="number" value={formData.totalQuestions} onChange={handleChange} required min="1" max="300" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-2/3 md:w-1/3 shadow-sm sm:text-sm border border-gray-300 rounded-md" />
        </div>
        <div>
          <button type="submit" disabled={loading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
            {loading ? 'Creating Test...' : 'Create Test'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTestForm;
