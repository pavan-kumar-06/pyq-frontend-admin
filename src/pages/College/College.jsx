import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../Constants';
import { useDispatch, useSelector } from 'react-redux';
import CreateCollege from './CreateCollege';
import { useNavigate } from 'react-router-dom';
import { deleteUserSuccess } from '../../redux/user/userSlice';
import { toast } from 'react-toastify';

const CollegePage = () => {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const dispatch = useDispatch();
  const [colleges, setColleges] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/college?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.data?.accessToken}`
        },
      });
      const data = await res.json();
      // console.log(data)
      if(data.statusCode === 407){
        //jwt token expired so we will signout the user 
        toast.error("Session Expired Please Login Again")
        dispatch(deleteUserSuccess(data));
      }
      setColleges(data.message.colleges);
      setPageInfo({
        page: data.message.page,
        totalPages: data.message.totalPages,
        totalCount: data.message.totalCount,
      });
    } catch (error) {
      console.log('Error fetching colleges:', error);
    }
    setIsLoading(false);
  };

  const handlePageChange = (newPage) => {
    fetchColleges(newPage);
  };

  // Other functions for updating and deleting colleges remain the same
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      ) : colleges?.length === 0 ? (
        <div className="text-center">
          <p>No colleges found.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => navigate('/create-college')}>Create New College</button>
        </div>
      ) : (
        <>
          {/* Render college table */}
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2">Name</th>
                <th className="py-2">Mobile Number</th>
                <th className="py-2">Email</th>
                <th className="py-2">City</th>
                <th className="py-2">State</th>
                <th className="py-2">Total Students</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges?.map((college, index) => (
                <tr key={college._id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="py-2 bg-gray-200 text-center">{college.name}</td>
                  <td className="py-2 bg-gray-200 text-center">{college.mobileNumber}</td>
                  <td className="py-2 bg-gray-200 text-center">{college.email}</td>
                  <td className="py-2 bg-gray-200 text-center">{college.city}</td>
                  <td className="py-2 bg-gray-200 text-center">{college.state}</td>
                  <td className="py-2 bg-gray-200 text-center">{college.totalStudents}</td>
                  <td className="py-2 text-center bg-gray-200">
                    <button className="bg-green-500  text-white px-2 py-1 rounded mr-2" onClick={() => handleUpdate(college)}>Update</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(college._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Render pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: pageInfo.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`mx-2 px-4 py-2 rounded ${pageInfo.page === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CollegePage;
