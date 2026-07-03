import {
 useUser
}
from "../context/UserContext";

const ProfilePage =
() => {

 const {
  user
 } =
 useUser();

 if (!user) {
  return (
   <h2>
    Please Login
   </h2>
  );
 }

 return (
  <div>

   <h1>
    Profile
   </h1>

   <p>
    Name:
    {user.name}
   </p>

   <p>
    Email:
    {user.email}
   </p>

  </div>
 );
};

export default ProfilePage;