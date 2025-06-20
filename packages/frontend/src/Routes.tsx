import { Route, Routes } from "react-router-dom";

import Signup from "./containers/Signup.tsx";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import NewNote from "./containers/NewNote.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/notes/new" element={<NewNote />} />
    </Routes>
  );
}