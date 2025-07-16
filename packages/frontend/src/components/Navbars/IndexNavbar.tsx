import { useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "@/lib/auth.ts";
import { useAppContext } from "@/lib/contextLib.ts";
import { House,Menu,Newspaper,Settings, UserRound } from 'lucide-react';
import Notifications from '../notification/Notifications';


export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { isAuthenticated , userHasAuthenticated } = useAppContext();
  const navigate = useNavigate();

  return (
    <nav className="top-0 fixed z-50 pt-10 w-full flex flex-wrap items-center justify-between px-2 navbar-expand-lg ">
      <div className="md:max-w-5xl container mx-auto flex flex-wrap items-center border justify-between py-2 bg-[#ffffff] px-4 rounded-xl backdrop-blur-xs">
      
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start items-center">
          <Link
            to="/"
            className="text-slate-700 flex text-sm font-bold leading-relaxed mr-4 whitespace-nowrap"
          > 
           
            <img src="/logo.png" alt="" className='rounde-xl w-10 h-10 -mb-3 mr-2'/>
            <p className="text-2xl"> Su-Kunst</p>
          </Link>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded-xl bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <Menu />
          </button>
        </div>

        <div className={"lg:flex flex-grow items-center lg:bg-opacity-0 lg:shadow-none" + (navbarOpen ? " block" : " hidden")} id="example-navbar-warning">
          
          {isAuthenticated ? 
            <ul className="flex lg:ml-auto">
              <li className="flex items-center">
                <Link to={'/opportunities'} >
                  <p className="px-5">
                    <House />
                  </p>
                </Link>
              </li>
              <li className="flex items-center">
                <Link to={'/newsfeed'} >
                  <p className="px-5">
                    <Newspaper />
                  </p>
                </Link>
              </li>
              <li className="flex items-center">
                <Link to={'/settings'} > 
                  <p className="px-5">
                   <Settings />
                  </p>
                </Link>
              </li>
            </ul>  
          :
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto font-medium">
              <li className="flex items-center">
                <Link to={'/pricing'} >
                  <p className="p-3">
                    Pricing
                  </p>
                </Link>
              </li>
              <li className="flex items-center">
                <Link to={'/blog'} >
                  <p className="p-3">
                    Blog
                  </p>
                </Link>
              </li>
              <li className="flex items-center">
                <Link to={'/contact'} > 
                  <p className="p-3">
                    Contact
                  </p>
                </Link>
              </li>
            </ul>
          }

          {isAuthenticated ? 
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="flex items-center p-2">
                <Notifications />
                <Link to={'/settings'} >
                  <UserRound/>
                </Link>
              </li>

              <li className="flex items-center">
                <button onClick={() => handleLogout(userHasAuthenticated, navigate)} className="hover:text-slate-500 text-white bg-black flex items-center text-lg rounded-xl lg:py-2 lg:px-6">
                  Logout
                </button>
              </li>
            </ul>
          :           
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="flex items-center p-3">
                <Link to={'/signup'} >
                <p className="text-white bg-black flex items-center text-lg rounded-xl lg:py-2 lg:px-6 mr-3 p-3">
                    Sign Up
                  </p>
                  </Link>
              </li>

              <li className="flex items-center p-3">
                <Link to={'/login'} > 
                  <p className="text-white bg-black flex items-center text-lg rounded-xl lg:py-2 lg:px-6 p-3">
                    Login
                  </p>
                </Link>
              </li>
            </ul> 
          }
          
        </div>

      </div>
    </nav>
  );
}
