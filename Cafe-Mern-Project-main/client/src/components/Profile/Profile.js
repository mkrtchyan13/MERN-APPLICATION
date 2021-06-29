import React, { useEffect, useState} from 'react';
import classes from "./Profile.module.css";
import axios from "axios";
import Login from '../Login/Login.js';
import Box from '../About/Box/Box.js';
import Text from '../Text/Text.js';
import profile from '../../assets/profile.png';
import jwt_decode from "jwt-decode";

export default function Profile() {
  const token = localStorage.getItem("token");

  if (token) {
    axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  }
  const decoded = jwt_decode(token).role;
 // console.log(decoded);

  const [userik] = useState(decoded);
 console.log(userik)

  const [values, setValues] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: ""
  });
  

  const [caf, setCafe] = useState({
    name: "",
    email: "",
    district: "",
    description: ""
  });

  async function fetchUserFromServer() {
    const result = await axios.get(`http://localhost:8050/users/me`);
    setValues(result.data);
  }

  async function fetchUserFromCafes() {
    const result = await axios.patch(`http://localhost:8050/cafes/mypage`);
    setCafe(result.data);
  }

  useEffect(()=>{
    fetchUserFromServer();
  },[]);

  useEffect(()=>{
    fetchUserFromCafes();
  },[]);


  if(token){
    return(
      <div>
      {userik === "user" ?
       ( <div className={classes.profile}>
          <Box 
            img={profile}
            par = "Account Settings "
            but = "Change Account"
            link="editProfile" />
            <Text 
            head = {values.firstName + " "+ values.lastName}
            par = {"Username: " + values.username}
            par1 = {"Email: " + values.email} />
  
          </div>) : 
           ( <div className={classes.profile}>
            <Box 
              img={profile}
              par = "Account Settings "
              but = "Change Account"
              link="editProfileCafe" />
              <Text 
              head = {caf.name}
              par = {"Description " + caf.description}
              par1 = {"Email: " + caf.email} />
    
            </div>)
          
          }
      </div>
    
    
    
    )
  }
  else {
    return(
    <Login />
    )
  }
}
