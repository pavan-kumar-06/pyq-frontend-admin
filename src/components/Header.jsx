import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../Constants";
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from "../redux/user/userSlice";

export default function Header() {
  const navigationLinks = [
    // { to: '/college', label: 'College' },
    { to: "/test", label: "Test" },
    // { to: '/questions', label: 'Questions'}
  ];

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${BACKEND_URL}/admin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data?.accessToken}`,
        },
      });

      const data = await res.json();
      // console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1>
            <span className="text-slate-700">Admin Dashboard</span>
          </h1>
        </Link>
        <ul className="flex gap-4">
          {/* <Link to="/">
            <li className="text-slate-700 hover:underline">Home</li>
          </Link> */}
          {navigationLinks.map(
            (link) =>
              currentUser !== null && (
                <Link to={link.to} key={link.to}>
                  <li className="text-slate-700 hover:underline">{link.label}</li>
                </Link>
              )
          )}
          {currentUser !== null ? (
            <li onClick={handleSignOut} className="text-slate-700 hover:underline">
              Logout
            </li>
          ) : (
            <Link to="/sign-in">
              <li className="text-slate-700 hover:underline">Sign In</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
