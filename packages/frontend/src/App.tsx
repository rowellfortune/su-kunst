// import Navbar from "react-bootstrap/Navbar";
import Routes from "./Routes.tsx";
import { useState, useEffect } from "react";
import { Provider } from 'react-redux';
import { AppContext, type AppContextType } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib";
import {store} from './store/index.ts'

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  // const nav = useNavigate();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      // check session
      await Auth.currentSession();
      // fetch the user’s attributes
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      userHasAuthenticated(true);
    } catch (error: any) {
      if (error !== "No current user") {
        onError(error);
      }
    }
    setIsAuthenticating(false);
  }

  const contextValue: AppContextType = {
    isAuthenticated,
    userHasAuthenticated,
    user,
    setUser,
  };

  return (
    (!isAuthenticating && isAuthenticated) && (
      <>
        <Provider store={store}>
          <AppContext.Provider value={contextValue}>
            <Routes />
          </AppContext.Provider>
        </Provider>
      </>
    )
  );
}

export default App;