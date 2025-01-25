import { useEffect,useState,useRef} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {Buffer} from 'buffer';


import "./styles/style.css";
import Profile from "./prof";
import Content  from "./content";


function Home(props){

    const navigate=useNavigate();

    const location = useLocation();
    const x = location.state?.uid;
    
    if(props.uid==null){
        var z=x;
    }
    else{
        var z=props.uid;
    }

    const [uid,setUid]=useState(z);

    const [userdata,setUserData]=useState({});

    function genOfImgURL(x){
        var base64Image = Buffer.from(x.data, "binary").toString("base64");
        var src = `data:image/jpeg;base64,${base64Image}`;
        return src;
    }

    useEffect(()=>{
        const fetchUserData=async()=>{
            if(uid==null){
                navigate("/");
            }
            else{
                try{
                    const response = await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/getUserData?uid=${uid}`);
                    var prof=genOfImgURL(response.data.profile);
                    var q={...response.data,
                        profile:prof};
                    setUserData(q);
                }catch(err){
                    console.log(err);
                    alert("error");
                }   
            }
        }
        fetchUserData();
    },[]);
    
    return(
        <div className="homeflex" style={{"position":"relative"}}>
            
            <div className="content">
                <Content profile={userdata.profile} />
            </div>
            <div className="profile">
                <Profile prof={userdata.profile} username={userdata.username} firstname={userdata.firstname} lastname={userdata.lastname}/>
            </div>
            
        </div>
    );
}

export default Home;