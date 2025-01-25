import React , {useState} from "react";
import axios from "axios";
import "./styles/login.css";

function Signup(props){

    const [data,setdata]=useState({
        firstname:"",
        lastname:"",
        email:"",
        username:"",
        password:""
    });

    const [result,setresult]=useState("");

    const [showDescription, setShowDescription] = useState(false);

    const passData=async (event) => {
        event.preventDefault();
        console.log(data);

        try{
            const res= await axios.post(`http://${process.env.REACT_APP_IP_ADD}:2000/signup/`,data);
            console.log(res);
            setresult(res.data);
            if(res.data==="successfully registered"){
                props.onsucess();
            }
        }catch(err){
            alert("Error");
        }
    }

    function change(event){
        const {name,value}=event.target;
        setdata((pre) =>{
            return({
                ...pre,
                [name]:value
            });
        });
    }

    return(
        <form className="login-form" style={{"paddingTop":"10px","paddingBottom":"10px"}}>
            <h2>Sign Up</h2>
            {result&&<h4 style={{"fontStyle":"italic","color":"blue","textAlign":"center","margin":"0px","marginBottom":"5px"}}>{result}</h4>}
            <div className="input-group">
                <label htmlFor="firstname">Firstname</label>
                <input  name="firstname" value={data.firstname} onChange={change} type="text" style={{"border":"1px solid #cccccc","borderRadius":"5px"}} />
            </div>

            <div className="input-group">
                <label htmlFor="lastname">Lastname</label>
                <input  name="lastname" value={data.lastname} onChange={change} type="text" style={{"border":"1px solid #cccccc","borderRadius":"5px"}}/>
            </div>

            <div className="input-group">
                <label htmlFor="email">E-Mail</label>
                <input  name="email" value={data.email} onChange={change} type="email" />
            </div>
            
            <div className="input-group">
                <label htmlFor="username">Username</label>
                <input  name="username" value={data.username} onChange={change} type="text" style={{"border":"1px solid #cccccc","borderRadius":"5px"}}/>
            </div>
            
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input  name="password" value={data.password} onChange={change} type="password" onFocus={() => setShowDescription(true)} onBlur={() => setShowDescription(false)} />
                {showDescription && (
                    <div style={{"width":"50px","float":"right","zIndex":"revert"}}>
                        <span className="description-text">Your password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.</span>
                    </div>
                )}
            </div>
            
            <button className="login" onClick={passData}>SignUp</button>
        </form>
    );
}

export default Signup;