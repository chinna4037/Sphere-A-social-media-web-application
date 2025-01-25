import  { useEffect, useState } from 'react';
import Reel from './reel';
import './styles/reels.css'; 

function Reels (props) {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const data = [
       'https://www.w3schools.com/html/mov_bbb.mp4',
         'https://www.w3schools.com/html/movie.mp4'
      ];

    setVideos(data);
  }, []);




  function increment(){
    // console.log("increment: "+currentIndex);
    if(currentIndex<videos.length-1){
      setCurrentIndex((prev)=>{
        return (prev+1);
      });
    }
  }

  function decrement(){
    // console.log("decrement: "+currentIndex);
    if(currentIndex>0)
    setCurrentIndex((prev)=>{
      return (prev-1);
    })
  }



  return (
    <div className="reels" >
    {/* {   videos.length!=0
        &&
        <Reel 
        data={videos[currentIndex]} 
        increment={increment}
        decrement={decrement}
        />
    } */}

    {videos.map((item,count)=>{
      return(<Reel data={item} />);
    })}
 
    </div> 
  );
}

export default Reels;
