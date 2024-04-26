import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure, deleteUserStart } from "../redux/user/userSlice";

import { BACKEND_URL } from "../Constants";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      dispatch(signInStart());
      const res = await fetch(`${BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/test");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  // Clear error state on component unmount or when the user refreshes the page
  // Clear error state on component mount
  useEffect(() => {
    dispatch(signInFailure(null));
  }, [dispatch]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" onChange={handleChange} />
        {/* <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        /> */}
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange} />

        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      {/* <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div> */}
      {error !== null && <p className="text-red-500 mt-5">{JSON.stringify(error)}</p>}
    </div>
  );
}
