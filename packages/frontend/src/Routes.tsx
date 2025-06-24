import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import NewNote from "./containers/NewNote.tsx";
import NewOppertunity from "./containers/NewOppertunity.tsx";

import Layout from "./layout/layout.tsx";
import Admin from "./layout/admin.tsx";
import Landing from "./layout/landing.tsx";

import Signup from "./containers/Signup.tsx";
import Login from "./containers/Login.tsx";

import ArtistSignup from "./auth/artist/Signup.tsx";
import AdminSignup from "./auth/admin/Signup.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="/" 
        element={
          <Landing children={<Home />} />
        }
      />

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;

      <Route path="/notes/new" 
        element={
          <Layout children={<NewNote />} />
        }
      />

      <Route path="/notes/oppertuniy/new" 
        element={
          <Admin children={<NewOppertunity />} />
        }
      />

      <Route path="/login" element={<Login />} />

      {/* User Auth Screens */}
      <Route path="/signup" element={<Signup />} />

      {/* Artist Auth screens */}
      <Route path="/artist/signup" element={<ArtistSignup />} />

      {/* Admin Auth Screens */}
      <Route path="/admin/signup" element={<AdminSignup />} />
      
    </Routes>
  );
}