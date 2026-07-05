import {
 Navigate
}
from "react-router-dom";

import {
 useUser
}
from "../context/UserContext";
import Loader from "./Loader";

const AdminRoute =
({ children }) => {

 const {
  user,
  loading
 } =
 useUser();

 if (loading) {
  return <Loader message="Verifying security credentials..." />;
 }

 if (
  !user
 ) {

  return (
   <Navigate
    to="/login"
   />
  );

 }

 if (
  user.role !==
  "admin"
 ) {

  return (
   <Navigate
    to="/"
   />
  );

 }

 return children;
};

export default AdminRoute;