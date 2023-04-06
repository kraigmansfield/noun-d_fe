import React, { useRef } from "react";
import "../Login/Login.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const Login = ({ setShowLogin, setCurrentUser }) => {
  const nameRef = useRef();
  const passRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: nameRef.current.value,
      password: passRef.current.value,
    };
    try {
      // const response = await axios.post("https://noun-d-be.herokuapp.com/api/users/login", newUser);
      const response = await axios.post("/users/login", newUser);
      setCurrentUser(response.data.username);
      setShowLogin(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="login_container">
      <div className="application">Login to your profile</div>
      <form onSubmit={handleSubmit}>
        <input className= "user_input"
        type="text" placeholder="username" ref={nameRef} />
        <input className= "pass_input" type="password" placeholder="password" ref={passRef} />
        <button className="login_button">Login</button>
      </form>
      <CloseIcon className="login_cancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};
export default Login;
