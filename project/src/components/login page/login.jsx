import React , {useState,useEffect} from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles/login.css";

import Home from "../home/home";

function Login(props){

    const navigate = useNavigate(); 

    const [resStyle,setResStyle]=useState({"color":"red"});

    const [det,setDet]=useState({
        username:"",
        password:""
    });
    const [result,setresult]=useState(props.x);
    

    useEffect(()=>{
      if(result==="successfully registered.Try login"){
        setResStyle({"color":"blue"});
      }
      else{
        setResStyle({"color":"red"});
      }
    },[result])

    const passData=async (event) => {
      event.preventDefault();
      if((det.password.length==0)||(det.username.length==0)){
      setresult("username or password must not be empty");
      }
      else{
        try{
          const data= await axios.post(`http://${process.env.REACT_APP_IP_ADD}:2000/login/`,det);
          console.log(data.data);
          setresult(data.data);
          if(data.data.msg=="Valid User"){
            navigate("/app",{state:{uid:data.data.uid}});
          }
        }catch(err){
          console.log(err.toString());
          alert("Error");
        }
      }
      
    };

    function change(event){
        const {name,value}=event.target;
        setDet((pre) =>{
            return({
                ...pre,
                [name]:value
            });
        });
    }

    return(
        <form className="login-form">
            <h2>Login</h2>
            {result&&<h4 style={{"fontStyle":"italic","textAlign":"center","margin":"0px","marginBottom":"5px",...resStyle}}>{result}</h4>}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input  name="username" onChange={change} value = {det.username}  type="email" />
            </div>

            <div className="input-group">
            <label htmlFor="password">Password</label>
            <input  name="password" onChange={change} value = {det.password}  type="password"/>
            </div>
            
            <button  className="login" onClick={passData} >Log IN</button>
            <p style={{"textAlign":"center","color":"blue"}}> forgot password?</p>
        </form>
        );
}

export default Login;