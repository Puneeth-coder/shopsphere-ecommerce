import { Navigate }
from "react-router-dom";

import {
 useUser
}
from "../context/UserContext";

const ProtectedRoute =
({ children }) => {

 const {
  user,
  loading,
 } =
 useUser();

 if (loading) {
  return (
   <h2>
    Loading...
   </h2>
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