import "./styles/upload.css"
import { useState,useEffect } from "react";
import axios from "axios";

export default function Upload(props){
  const [des,setDes]=useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [color,setColor]=useState("black");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(color!=="red"){
      const formData = new FormData();
      const fileType = selectedFile.type;
      formData.append("image", selectedFile);
      formData.append("uid", props.uid);
      formData.append("type", fileType.substring(0, 5));
      formData.append("size", selectedFile.size);

      try {
        await axios.post(`http://${process.env.REACT_APP_IP_ADD}:2000/get/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setDes(null);
        props.toggle();
        setColor("black");
        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("error");
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
    if ((!fileType.startsWith("image/"))&&(!fileType.startsWith("video/"))){
      setDes("incorrect format is selected");
      setColor("red");
      return;
    }
    setDes(selectedFile.name);
    setColor("black");
  },[selectedFile]);

  return(
      <div className="Upload" onClick={(event)=>{
          //event.preventDefault();
          props.toggle();
          event.stopPropagation();
      }}>
      <div className="upflex"  onClick={(event)=>{
          //event.preventDefault();
          event.stopPropagation();
      }}>
        <button className="crossicon" onClick={(event)=>{
          event.preventDefault();
          props.toggle();
          event.stopPropagation();
        }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg></button>
        
        <div style={{"fontWeight":"bold","fontSize":"1.2em"}}>Upload a new post</div>
        <br />
        <br />
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16"><path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
        <div className="fileContainer">
          <input
            type="file"
            accept="image/*,video/*"
            name="fileInput"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="file-label">Choose Files From your Computer</label>
        </div>
        <br />
        <div style={{"color":color}}>{des}</div>
        <br />
        <button className="upload"  onClick={handleSubmit}>Upload</button>
      </div>
    </div>
  );
}