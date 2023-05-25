import React, { useRef } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import '../Register/Register.css';
import axios from "axios";


const Register = ({setShowRegister}) => {

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async(e) => {
    e.preventDefault()

    const newUser = {
      username : nameRef.current.value,
      email : emailRef.current.value,
      password: passwordRef.current.value
    }

    try{
      const response = await axios.post('https://nound.herokuapp.com/api/users/register',newUser)
      // const response = await axios.post('/users/register',newUser)
      console.log(response)
      setShowRegister(false)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='register_container'>
      <div className='application'>
        Create a Profile
      </div>
      <form onSubmit={handleSubmit}>
        <input className ="username_input" type="text" placeholder='username' ref={nameRef}/>
        <input className ="email_input"   type="email" placeholder='email' ref={emailRef}/>
        <input className ="password_input"  type="password" placeholder='password' ref={passwordRef}/>
        <button className='register'>Register</button>

      </form>
        <CloseIcon className="register_cancel" onClick={() => setShowRegister(false)} />
    </div>
  )
}

export default Register