import { Navigate }
from "react-router-dom";

import {
 useUser
}
from "../context/UserContext";

import Loader from "./Loader";

const ProtectedRoute =
({ children }) => {

 const {
  user,
  loading,
 } =
 useUser();

 if (loading) {
  return (
   <Loader message="Waking up server nodes... This might take up to 30 seconds." />
  );
 }

 return user
  ? children
  : (
   <Navigate
    to="/login"
   />
  );
};

export default ProtectedRoute;