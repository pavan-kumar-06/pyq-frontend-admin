import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BACKEND_URL } from "../../Constants";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUserSuccess } from "../../redux/user/userSlice";

function Test() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch function
  // const [searchParams] = useSearchParams();
  // const year = searchParams.get("year");
  const currentUser = useSelector((state) => state.user?.currentUser);
  // const [filterYear, setFilterYear] = useState("");
  const [tests, setTests] = useState([]);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPrevPage: false,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchTests();
  }, []);

  // const handleFilterChange = (e) => {
  //   setFilterYear(e.target.value);
  // };
  // const handleFilterClick = () => {
  //   const queryParams = new URLSearchParams();
  //   if (filterYear) {
  //     queryParams.append("year", filterYear);
  //   }
  //   navigate(`/test?${queryParams.toString()}`);
  // };

  const fetchTests = async (page = 1) => {
    try {
      // console.log(year);
      const response = await fetch(`${BACKEND_URL}/test?page=${page}}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data?.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 407) {
        //jwt token expired so we will signout the user
        toast.error("Session Expired Please Login Again");
        dispatch(deleteUserSuccess(data));
        // navigate("/sign-in");
      }
      // console.log(data.data?.tests)
      setTests(data.data?.tests);
      setPagination(data.data?.pagination);
    } catch (error) {
      toast.error("Server is Unreachable try again");
      // console.error("Error fetching tests:", error);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this test?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              // console.log(id)
              await fetch(`${BACKEND_URL}/test/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${currentUser?.data?.accessToken}`,
                },
              });
              toast.success("Test deleted Successfully");
              fetchTests(pagination.currentPage); // Fetch tests again for the current page
            } catch (error) {
              console.log(error);
              toast.error("Error occured while deleting the test");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="flex flex-col">
      <Link to="/create-test" className="m-5 mr-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end">
        Add New Test
      </Link>
      <div>
        {/* <div className="flex-row center mb-5">
          <input type="text" value={filterYear} onChange={handleFilterChange} placeholder="Filter by Year" className="p-2 border border-gray-300 rounded-md" />
          <button onClick={handleFilterClick} className="m-5 mr-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end">
            Filter
          </button>
        </div> */}
        <div className="flex-row center h-[80%]">
          <table className="bg-red table-auto border-collapse border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Test Name</th>
                <th className="border px-4 py-2">Test Type</th>
                <th className="border px-4 py-2">Test Year</th>
                <th className="border px-4 py-2">Test Duration</th>
                <th className="border px-4 py-2">Total Questions</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id}>
                  <td className="border px-4 py-2">{test.testName}</td>
                  <td className="border px-4 py-2">{test.testType}</td>
                  <td className="border px-4 py-2">{test.testYear}</td>
                  <td className="border px-4 py-2">{test.testDuration}</td>
                  <td className="border px-4 py-2">{test.totalQuestions}</td>
                  <td className="border px-4 py-2">
                    <Link to={{ pathname: `/update-test/${test._id}` }}>
                      <button className="blue-button">Update Test</button>
                    </Link>
                    <button onClick={() => handleDelete(test._id)} className="red-button">
                      Delete Test
                    </button>
                    <Link to={{ pathname: `/question/${test._id}/1` }} className="mr-2">
                      <button className="blue-button">Update Questions</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-row center">
          {pagination && (
            <div className="mt-4">
              {pagination.hasPrevPage && <button onClick={() => fetchTests(pagination.currentPage - 1)}>Previous</button>}
              <span className="mx-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              {pagination.hasNextPage && <button onClick={() => fetchTests(pagination.currentPage + 1)}>Next</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
