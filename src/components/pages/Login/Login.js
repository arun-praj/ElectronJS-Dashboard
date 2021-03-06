import React, { useEffect, useState } from "react";
import axios from "axios";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";

//components
import Button from "../../ui/Button/Button";
import Spinner from "../../ui/Spinner/Spinner";

//css
import "./Login.scss";
// import { ipcRenderer } from "electron-better-ipc";

// const { ipcRenderer: ipc } = window.require("electron-better-ipc");
const { ipcRenderer } = window.require("electron");

// export const loadUser = (setIsAuth) => {
//    const config = {
//       headers: {
//          "Content-Type": "application/json",
//       },
//    };
//    axios
//       .get("https://dhaushop.herokuapp.com/api/auth/me", config)
//       .then((res) => {
//          setIsAuth(true);
//       })
//       .catch((e) => {
//          setIsAuth(false);
//       });
// };

export const Login = (props) => {
   //set token in store

   const [error, setError] = useState("");
   const { promiseInProgress } = usePromiseTracker();
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };
   const onButtonClick = (e) => {
      e.preventDefault();
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      console.log(formData);
      const body = {
         email: formData.email,
         password: formData.password,
      };
      trackPromise(
         axios
            .post("https://dhaushop.herokuapp.com/api/auth/login", JSON.stringify(body), config)
            .then((res) => {
               if (res.data.token) {
                  // setAuthToken(res.data.token);
                  ipcRenderer.send("set-token", res.data.token);
                  props.setAuth(true);
                  return;
               }
            })
            .catch((e) => {
               console.log(e);
               setError("Email or Password incorrect");
               setTimeout(() => setError(""), 5000);
            })
      );
   };

   return (
      <>
         <div className='login'>
            <div className='login__form'>
               <div
                  style={{ display: error.length > 0 ? "block" : "none" }}
                  className='login__error--box'>
                  <div className='login__error--text'>Incorrect email or password</div>
               </div>
               <div className='login__form--heading'>Welcome back ;)</div>

               <form action='' className='login__form--box' noValidate>
                  <label className='login__form--box--label'>Email</label>
                  <input
                     type='email'
                     name='email'
                     className='login__form--box--input'
                     placeholder='example@email.com'
                     onChange={handleChange}
                  />
                  <label className='login__form--box--label'>Password</label>

                  <input
                     type='password'
                     name='password'
                     className='login__form--box--input'
                     placeholder='Required'
                     onChange={handleChange}
                  />
                  <Button
                     //   onClick={login}
                     style={{
                        width: "100%",
                        borderRadius: "4px",
                        height: "30px",
                        marginBottom: "16px",
                        position: "relative",
                     }}
                     onclick={onButtonClick}
                     value={
                        promiseInProgress ? (
                           <div>
                              <Spinner />
                           </div>
                        ) : (
                           "Login"
                        )
                     }
                     type='blue'
                  />

                  <label className='login__form--box--warning'>
                     Note: Must have an admin account in <a href='#'>dhaushop.herokuapp.com</a>
                  </label>
               </form>
            </div>
         </div>
      </>
   );
};

// export default Login;
