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

import UserProfile from "./containers/UserProfile";

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
import Account from "./containers/settings/Account";
import Appearance from "./containers/settings/Appearance";
import Notifications from "./containers/settings/Notifications";
import ProfileLayout from "./layout/profile";
import ForgotPassword from "./containers/ForgotPassword";
import Opportunity from "./components/opportunities/Opportunity";

export default function Links() {
  return (
    <Routes>
      <Route path="/" 
        element={
          <AuthenticatedRoute>
            <AppLayout children={<Home/>} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/events" 
        element={
          <AuthenticatedRoute>
            <AppLayout children={<Events />} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/marketplace" 
        element={
          <AuthenticatedRoute>
            <AppLayout children={<Events />} />
          </AuthenticatedRoute>
        }
      />

      {/* Post */}
      <Route path="/posts/new" 
        element={
          <AuthenticatedRoute>
            <Landinglayout children={<NewPost />} />
          </AuthenticatedRoute>
        }
      />

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;

      <Route path="/admin/opportunities/new" 
        element={
        <AdminRoute>
          <AuthenticatedRoute>
            <Admin children={<NewOppertunity />} />
          </AuthenticatedRoute>
        </AdminRoute>
        }
      />

      <Route path="/login" 
        element={
          <UnauthenticatedRoute>
            <Landinglayout children={<Login />} />
          </UnauthenticatedRoute>
        } 
      />

      <Route 
        path="/profile/:id" 
        element={
          <AuthenticatedRoute>
            <ProfileLayout children={ <UserProfile />} />
          </AuthenticatedRoute>
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

      <Route 
        path="/forgot-password" 
        element={
          <UnauthenticatedRoute>
            <Landinglayout children={ <ForgotPassword />} />
          </UnauthenticatedRoute>
        } 
      />

      {/* Artist Auth screens */}
      <Route 
        path="/artist/signup"
        element={ 
          <UnauthenticatedRoute>
            <Landinglayout children={ <ArtistSignup />} />
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
          <AuthenticatedRoute>
            <AppLayout children={ <Opportunity />} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/ads/:id" 
        element={
          <AuthenticatedRoute>
          <AppLayout children={ <Ad />} />
        </AuthenticatedRoute>
        }
      />

      <Route path="/ads/edit/:id" 
        element={
          <AuthenticatedRoute>
          <Admin children={ <UpdateAd />} />
        </AuthenticatedRoute>
        }
      />

  {/* Start Admin Routes */}
      <Route path="/admin/" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
            <Admin children={<AdminDashboard/>} />
          </AuthenticatedRoute>
          </AdminRoute>
        } 
      />
      <Route path="/admin/inbox" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
            <InboxLayout children={<Inbox />} />
          </AuthenticatedRoute>
          </AdminRoute>
        } 
      />

      <Route path="/admin/user" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
            <Admin children={<User />} />
          </AuthenticatedRoute>
          </AdminRoute>
        } 
      />

      <Route path="/admin/opportunities" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<Opportunities />} />
            </AuthenticatedRoute>
          </AdminRoute>
        } 
      />

      <Route path="/admin/companies" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<Companies />} />
            </AuthenticatedRoute>
          </AdminRoute>
        } 
      />

      <Route path="/admin/organizations" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<Organizations />} />
            </AuthenticatedRoute>
          </AdminRoute>
        } 
      />

      <Route path="/admin/ad-data" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<AdData />} />
            </AuthenticatedRoute>
          </AdminRoute>
        }
      />

    {/* Ads Routes */}
      <Route path="/admin/ads/new" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<NewAd />} />
            </AuthenticatedRoute>
          </AdminRoute>
        }
      />

      <Route path="/admin/ads/live" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<LiveAds />} />
            </AuthenticatedRoute>
          </AdminRoute>
        }
      />

      <Route path="/admin/ads" 
        element={
          <AdminRoute>
            <AuthenticatedRoute>
              <Admin children={<AllAds />} />
            </AuthenticatedRoute>
          </AdminRoute>
        }
      />
    {/* Ads Routes */}


  {/* End Admin Routes */}

  {/* Start Settings */}

      <Route path="/settings" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Settings />} />
          </AuthenticatedRoute>
        }
      />

      

      <Route path="/settings/profile" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Profile />} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/settings/account" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Account />} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/settings/appearance" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Appearance />} />
          </AuthenticatedRoute>
        }
      />

      <Route path="/settings/notifications" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Notifications />} />
          </AuthenticatedRoute>
        }
      />

  {/* End Settings Route */}

      <Route path="/inbox" 
        element={
          <AuthenticatedRoute>
            <SettingsLayout children={<Inbox />} />
          </AuthenticatedRoute>
        }
      />
      
    </Routes>
  );
}