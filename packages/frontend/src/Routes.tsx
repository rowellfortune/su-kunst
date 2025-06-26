import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import NewNote from "./containers/NewNote";
import NewOppertunity from "./containers/NewOppertunity";

import Layout from "./layout/layout.tsx";
import Admin from "./layout/admin.tsx";
import Landing from "./layout/landing";
import SettingsLayout from "./layout/settings";

import Signup from "./containers/Signup";
import Login from "./containers/Login";

import ArtistSignup from "./auth/artist/Signup";
import AdminSignup from "./auth/admin/Signup";

// Setting 
import Settings from "./containers/Settings";
import Profile from "./containers/Profile";
import Inbox from "./containers/Inbox";
import NewPost from "./containers/NewPost";

export default function Links() {
  return (
    <Routes>
      <Route path="/" 
        element={
          <Landing children={<Home />} />
        }
      />


      {/* Post */}
      <Route path="/posts/new" 
        element={
          <Landing children={<NewPost />} />
        }
      />

      {/*  */}

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

      {/* Settings */}
      <Route path="/settings" 
        element={
          <SettingsLayout children={<Settings />} />
        }
      />
      <Route path="/settings/profile" 
        element={
          <SettingsLayout children={<Profile />} />
        }
      />

      <Route path="/inbox" 
        element={
          <SettingsLayout children={<Inbox />} />
        }
      />
      
    </Routes>
  );
}