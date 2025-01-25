import { useSwipeable } from 'react-swipeable';
import './styles/reel.css'; 
import { useState,useRef,useEffect } from 'react';

function Reel(props){

    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const handleMuteUnmute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
      }
    };


    const scrollContainerRef = useRef(null);
    const [lastScrollTop, setLastScrollTop] = useState(0);
  
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current;
      const currentScrollTop = scrollContainer.scrollTop;
  
      if (currentScrollTop > lastScrollTop) {
        // console.log("Scrolling down");
        // Call your function for scrolling down
        onScrollDown();
      } else {
        // console.log("Scrolling up");
        // Call your function for scrolling up
        onScrollUp();
      }
  
      setLastScrollTop(currentScrollTop);
    };
  
    const onScrollUp = () => {
      // Your logic for scrolling up
    //   console.log("Executed scroll up function");
        props.decrement();
    };
  
    const onScrollDown = () => {
      // Your logic for scrolling down
    //   console.log("Executed scroll down function");
        props.increment();
    };
  
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
  
        return () => {
          scrollContainer.removeEventListener("scroll", handleScroll);
        };
      }
    }, [lastScrollTop]);

    


    const handlers = useSwipeable({
        onSwipedUp: () =>props.decrement(),
        onSwipedDown: () =>props.increment(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
        trackTouch:true,
        preventScrollOnSwipe:true,
      });

    

    function KeyChange(event){
        if(event.key=="ArrowUp"){
            props.decrement();
        }
        if(event.key=="ArrowDown"){
            props.increment();
        }
    }

    return(
    <div 
        {...handlers}
        className='reel'
        ref={scrollContainerRef} 
        tabIndex="0" 
        onClick={handleMuteUnmute} 
        onKeyDown={KeyChange}
        >
        <video 
            ref={videoRef}
            src={props.data}
            preload="auto" 
            autoplay=""
            loop 
            muted="muted"
            disablePictureInPicture
        />
    </div>);
}

export default Reel;

{/* <ReactPlayer
        className='reactPlayer'
        url={data}
        playing={true}
        pip={false}
        loop={true}
    />  */}
