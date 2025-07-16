import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import NewOppertunity from "./containers/NewOppertunity";

// import Layout from "./layout/layout";
import Admin from "./layout/admin";
import InboxLayout from "./layout/inbox"
import Landinglayout from "./layout/landing";
import SettingsLayout from "./layout/settings";

import Signup from "./containers/Signup";
import Login from "./containers/Login";
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'

import ArtistSignup from "./auth/artist/Signup";
import AdminSignup from "./auth/admin/Signup";

import AdminDashboard from "./containers/admin/AdminDashboard";
// Setting 
import Settings from "./containers/settings/Settings";
import Profile from "./containers/settings/Profile";

// Inbox
import Inbox from "./containers/Inbox";
import NewPost from "./containers/NewPost";
import Opportunities from "./containers/admin/Opportunities";
// import Ads from "./containers/admin/Ads";
import Ad from "./containers/Ad";
import AdminRoute from "./components/AdminRoute";
import User from "./containers/admin/User";
import Organizations from "./containers/admin/Organizations";
import Companies from "./containers/admin/Companies";
import AdData from "./containers/admin/AdData";
import LiveAds from "./containers/admin/ads/LiveAds";
import NewAd from "./containers/admin/ads/NewAd";
import AllAds from "./containers/admin/ads/AllAds";
import UpdateAd from "./containers/admin/ads/UpdateAd";
import Events from "./containers/Events";
import AppLayout from "./layout/applayout";

export default function Links() {
  return (
    <Routes>
      <Route path="/" 
        element={
          <AppLayout children={<Home/>} />
        }
      />

      <Route path="/events" 
        element={
          <AppLayout children={<Events />} />
        }
      />

      <Route path="/marketplace" 
        element={
          <AppLayout children={<Events />} />
        }
      />

      {/* Post */}
      <Route path="/posts/new" 
        element={
          <Landinglayout children={<NewPost />} />
        }
      />

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;

      <Route path="/admin/opportunities/new" 
        element={
          <AdminRoute>
            <Admin children={<NewOppertunity />} />
          </AdminRoute>
        }
      />

      <Route path="/login" 
        element={
          <Landinglayout children={<Login />} />
        } 
      />

      {/* User Auth Screens */}
      <Route 
        path="/signup" 
        element={
          <UnauthenticatedRoute>
            <Landinglayout children={ <Signup />} />
          </UnauthenticatedRoute>
        } 
      />

      {/* Artist Auth screens */}
      <Route 
        path="/artist/signup"
        element={ 
          <UnauthenticatedRoute>
            <ArtistSignup />
          </UnauthenticatedRoute>
        } 
      />

      {/* Admin Auth Screens */}
      <Route path="/admin/signup" 
        element={
          <UnauthenticatedRoute>
            <AdminSignup />
          </UnauthenticatedRoute>
        } 
      />

      <Route path="/opportunities/:id" 
        element={
          <Landinglayout children={ <Ad />} />
        }
      />

      <Route path="/ads/:id" 
        element={
          <Landinglayout children={ <Ad />} />
        }
      />

      <Route path="/ads/edit/:id" 
        element={
          <Landinglayout children={ <UpdateAd />} />
        }
      />

  {/* Start Admin Routes */}
      <Route path="/admin/" 
        element={
          <AdminRoute>
            <Admin children={<AdminDashboard/>} />
          </AdminRoute>
        } 
      />
      <Route path="/admin/inbox" 
        element={
          <AdminRoute>
            <InboxLayout children={<Inbox />} />
          </AdminRoute>
        } 
      />

      <Route path="/admin/user" 
        element={
          <AdminRoute>
            <Admin children={<User />} />
          </AdminRoute>
        } 
      />

      <Route path="/admin/opportunities" 
        element={
          <AdminRoute>
            <Admin children={<Opportunities />} />
          </AdminRoute>
        } 
      />

      <Route path="/admin/companies" 
        element={
          <AdminRoute>
            <Admin children={<Companies />} />
          </AdminRoute>
        } 
      />

      <Route path="/admin/organizations" 
        element={
          <AdminRoute>
            <Admin children={<Organizations />} />
          </AdminRoute>
        } 
      />

      <Route path="/admin/ad-data" 
        element={
          <AdminRoute>
            <Admin children={<AdData />} />
          </AdminRoute>
        }
      />

    {/* Ads Routes */}
      <Route path="/admin/ads/new" 
        element={
          <AdminRoute>
            <Admin children={<NewAd />} />
          </AdminRoute>
        }
      />

      <Route path="/admin/ads/live" 
        element={
          <AdminRoute>
            <Admin children={<LiveAds />} />
          </AdminRoute>
        }
      />

      <Route path="/admin/ads" 
        element={
          <AdminRoute>
            <Admin children={<AllAds />} />
          </AdminRoute>
        }
      />
    {/* Ads Routes */}


  {/* End Admin Routes */}

  {/* Start Settings */}

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

      <Route path="/settings/account" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Profile />} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/settings/appearance" 
        element={
          <SettingsLayout children={<Profile />} />
        }
      />

  {/* End Settings Route */}

      <Route path="/inbox" 
        element={
          <SettingsLayout children={<Inbox />} />
        }
      />
      
    </Routes>
  );
}