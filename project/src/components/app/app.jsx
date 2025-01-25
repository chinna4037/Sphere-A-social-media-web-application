import { useEffect,useState,useRef,useLayoutEffect} from "react";
import { useNavigate, useLocation,Route,Routes } from "react-router-dom";
import useStateref from 'react-usestateref'
import {socket} from "../../socket.js";
import axios from "axios";


import Nav from "./Nav";
import "./styles/app.css";
import SmallNav from "./smallNav";
import Search from "../search/search";
import Home from "../home/home";
import Profile from "../profile/profile";
import Upload from "../upload/upload";
import Message from "../messages/msg";
import Reels from "../reels/reels.jsx";

export default function App2(){


    const navigate = useNavigate(); 

    const location = useLocation();
    const x = location.state?.uid;
    const [uid,setUid]=useState(x);


    useLayoutEffect(()=>{
        const re=()=>{
            console.log("show search "+Search.current);
            if (window.innerWidth < 1000 || Search.current==true) {
                setNav(true);
              }
              else{
                if(Nav){
                    setNav(false);
                }
              }
        };
        window.addEventListener("resize",re);
        re();
        return ()=>{
            window.removeEventListener("resize",re);
        };
    },[])
    
   
    useEffect(() => {
        const handleResize = () => {
            
        };
    
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
   
  
    useEffect(() => {
      function onConnect() {
        console.log("connected");
        socket.emit("allroom",uid);
      }
  
      function onDisconnect() {
       console.log("disconnected");

      }
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        
      };
    }, []);

    //console.log(socket);

    const [showSearch,setShowSearch]=useState(false);
    // const Search=useRef(showSearch);

    const [nav,setNav]=useState(window.innerWidth>1000);

    function togglenav(){
        setNav((prev)=>{
            return (!prev);
        });
    }

    async function toogleSearch(){
        // togglenav();
        setShowSearch((prev)=>{
            return (!prev);
        });
    }

    const [previous,setPrevious]=useState(false);
    useEffect(()=>{
        const fun= () =>{
            // Search.current=showSearch;
            console.log("showsearch in useeffect :- "+showSearch);
            //for responasive search
            if(showSearch){
                setPrevious(nav);
                setNav(true);
            }
            else{
                // console.log("previous "+previous);
                if(!previous || window.innerWidth >=1000){
                    setNav(false);
                }
            }
        };
        fun();
    },[showSearch])

    const referenceDivRef = useRef(null);
    const [marginLeft, setMarginLeft] = useState(0);
  
    useLayoutEffect(() => {
        const updateMargin = () => {
          if (referenceDivRef.current) {
            const referenceDivWidth = referenceDivRef.current.offsetWidth;
            // console.log(referenceDivRef.current.offsetWidth);
            setMarginLeft(referenceDivWidth);
          }
        };
    
        updateMargin(); // Initial calculation
        window.addEventListener('resize', updateMargin); // Update on resize
        // Cleanup event listener on component unmount
        return () => {
          window.removeEventListener('resize', updateMargin);
        };
      }, [nav])
    
    const [showUpload,setShowUpload]=useState(false);

    async function toogleUpload(){
        setShowUpload((prev)=>{
            return (!prev);
        });
    }

   

    useEffect(()=>{
        if(uid==null){
            navigate("/");
        }
    },[])

    return(
        <div className="grid" style={{"position":"relative"}}>
            <div className="notscroll" ref={referenceDivRef}>
                {nav?
                    <SmallNav search={toogleSearch} uid={uid} upload={toogleUpload} nav={togglenav}/>
                :
                    <Nav search={toogleSearch} uid={uid} upload={toogleUpload} nav={togglenav}/>
                }
            </div>
            {showSearch&&<div style={{"position":"fixed","marginLeft":"70px","marginRight":"10px"}} className="notscroll">
                <Search uid={uid} />
            </div>}
            
            {showUpload && <Upload toggle={toogleUpload} uid={uid} />}
            
            <div  style={{"width":"100%","paddingLeft":"10px","marginLeft":marginLeft}} onClick={()=>{setShowSearch(false);}}>
                <Routes>
                    <Route path="/" element={<Home  uid={uid}/>} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/msg" element={<Message setNav={setNav}/>} />
                    <Route path="/reels" element={<Reels />} />
                </Routes>
            </div>

        </div>
    );

}