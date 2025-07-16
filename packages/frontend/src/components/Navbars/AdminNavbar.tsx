import { Link, useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from 'react';
// import { onError } from "../../lib/errorLib";
import { handleLogout } from "../../lib/auth.ts";
import { useAppContext } from "../../lib/contextLib.ts";
// import { Auth } from "aws-amplify";

export default function Navbar() {
  const { userHasAuthenticated } = useAppContext();
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center">
      <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
        {/* Brand */}
        <p
          className="text-black text-sm uppercase hidden lg:inline-block font-semibold"
          onClick={(e) => e.preventDefault()}
        >
          Dashboard
        </p>

        <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
          <li className="flex items-center">
            <Link to="/settings">
              <p className="hover:text-slate-500 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
              Settings
              </p>
            </Link>
          </li>
          <li className="flex items-center">
            <button onClick={() => handleLogout(userHasAuthenticated, navigate)} className="hover:text-slate-500 text-white px-3 lg:py-2 flex items-center text-xs uppercase font-bold rounded-md bg-gradient-to-r from-cyan-500 to-blue-500">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
