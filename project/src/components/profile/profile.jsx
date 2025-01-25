import "./styles/profile.css";
import { useEffect } from "react";
import useState from 'react-usestateref';
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import Posts from "./posts";
import Follows from "./follows/follows";

export default function Profile(props) {

  const [des,setDes]=useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [color,setColor]=useState("black");

  const navigate=useNavigate();
  const location = useLocation();
  const x = location.state?.uid;
  const [uid,setUid]=useState(x);

  const [followsBool,setFollowsBool]=useState(false);

  function toogleFollow(){
    setFollowsBool((prev)=>{
      return !prev;
    })
  }

  const [userdata,setUserData,userdataRef]=useState({});

  const [changePhoto,setChangePhoto]=useState(false);

  const [uploadprofile,setUploadProfile]=useState(false);

  function togglePhoto(){
    setChangePhoto((prev)=>{
      return (!prev);
    });
  }

  function toggleupload(){
    setUploadProfile((prev)=>{
      return (!prev);
    });
  }

  function ChangePhoto(){
    return(
      <div id="changephoto" onClick={(event)=>{
        event.preventDefault();
        event.stopPropagation();
      }}>
        <div style={{"gridColumn":"span 2"}}>Do you want to change profile photo?</div>
        <button className="yes" onClick={(event)=>{
          event.preventDefault();
          toggleupload();
          event.stopPropagation();
        }}>yes</button>
        <button className="no" onClick={(event)=>{
          event.preventDefault();
          console.log("no");
          togglePhoto();
          event.stopPropagation();
        }}>no</button>
      </div>
    );
  }
  var resultPro;
  function UploadProfile() {

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
      resultPro=event;
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      if(color!="red"){
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("uid",uid);
        try {
          await axios.post(`http://${process.env.REACT_APP_IP_ADD}:2000/update/profile`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          const reader = new FileReader();
          reader.onload = (resultPro) => {
          setUserData((prev)=>{
            return({
              ...prev,
              profile:resultPro.target.result
            });
          })
          };
          reader.readAsDataURL(selectedFile);
          setDes(null)
          setColor("black");
          setChangePhoto(false);
        } catch (error) {
          console.error(error);
          alert("error")
        }
      }
    };

    useEffect(()=>{
      if (!selectedFile) {
        setDes("No file selected");
        setColor("red");
        return;
      }
      const fileType = selectedFile.type;
      if (!fileType.startsWith("image/")){
        setDes("incorrect format is selected");
        setColor("red");
        return;
      }
      setDes(selectedFile.name);
      setColor("black");
    },[selectedFile]);

    return(
      <div className="uploadprofile" onClick={(event)=>{
        //event.preventDefault();
        event.stopPropagation();
      }}>
        <button className="crossicon" onClick={()=>{
          setDes(null)
          setColor("black");
          setChangePhoto(false);
        }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg></button>
        
        <div style={{"fontWeight":"bold","fontSize":"1.2em"}}>Change Profile Photo</div>
        <br />
        <br />
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16"><path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
        <div className="fileContainer">
          <input
            type="file"
            accept="image/*"
            name="fileInput"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="fileInput" className="file-label">Choose Files From your Computer</label>
        </div>
        <br />
        <div style={{"color":color}}>{des}</div>
        <br />
        <button className="upload" onClick={handleSubmit}>Change Profile photo</button>
      </div>
    );
    
  }

  

  useEffect(()=>{
      if(uid==null){
          navigate("/");
      }
      else{ 
        const fun=async()=>{
          try{
            var response=await axios.get(`http://${process.env.REACT_APP_IP_ADD}:2000/getProfile?uid=${uid}`);
            var q=response.data;
            setUserData(q);
           // console.log(userdataRef.current);
          }
          catch(err){
            console.log(err);
            alert("error");
          }
        }
        fun();
      }
  },[])






  return (
    <div className="ProApp" >
      <div className="progrid">
          <div className="imageContainer" onClick={togglePhoto}>
            <img  className="proimg" src={userdata.profile} alt="profile photo"></img>
          </div>
          <div>
          <button><h4>Posts</h4>{userdata.postsNo}</button>
          </div>
          <div>
          <button onClick={toogleFollow}><h4>Followers</h4>{userdata.followedNo}</button>
          </div>
          <div>
          <button onClick={toogleFollow}><h4>Following</h4>{userdata.followingNo}</button>
          </div>
      </div>
      {followsBool&&<Follows toggle={toogleFollow} uid={uid}/>}
      <br />
      <div className="prousername">
        {userdata.username}
      </div>
      <div className="proname">
        {userdata.firstname} {userdata.lastname}
      </div>
      <br/>
      <div className="bio">
        <div className="heading">
          Bio
        </div>
        <div className="content">
          {userdata.bio}
        </div>
      </div>
      <br/>
      <hr />
      <div className="saved">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" height={"20px"} viewBox="0 0 512 512">
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm88 64v64H64V96h88zm56 0h88v64H208V96zm240 0v64H360V96h88zM64 224h88v64H64V224zm232 0v64H208V224h88zm64 0h88v64H360V224zM152 352v64H64V352h88zm56 0h88v64H208V352zm240 0v64H360V352h88z" />
          </svg>
          Posts
        </button>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" height={"20px"} viewBox="0 0 384 512">
            <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
          </svg>
          Saved
        </button>
      </div>
      <Posts uid={uid}/>



      {changePhoto&&
      <div style={{"position":"absolute","top":"0px","left":"0px"}}>
        <div id="changephotocon" onClick={(event)=>{
          //event.preventDefault();
          togglePhoto();
          setUploadProfile(false);
          setDes(null)
          setColor("black");
          setChangePhoto(false);
          event.stopPropagation();
          }}>
          {uploadprofile?<UploadProfile />:<ChangePhoto />}
        </div>
      </div>}
    </div>
  );
}

