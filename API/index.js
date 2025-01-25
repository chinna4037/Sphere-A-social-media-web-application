const ex=require("express");
const bodyParser =require("body-parser");
const cors=require("cors");
const HTTP=require("http");
const {Server}=require("socket.io");
const pg=require("pg");



const login =require("./routes/login Api/login.js");
const signup =require("./routes/login Api/signup.js");
const get =require("./routes/get.js");
const getUserData =require("./routes/Get userdata/get.js");
const search =require("./routes/search/search.js");
const following =require("./routes/following/following.js");
const getFullProfile =require("./routes/Get userdata/fullprofile.js");
const update =require("./routes/update Full Profile/update.js");
const msgList =require("./routes/msg/getlist.js");
const chat=require("./routes/msg/chat.js");
const history=require("./routes/msg/history.js");
const posts=require("./routes/Get userdata/posts.js");
const reels=require("./routes/reels/reels.js");
const getfollows=require("./routes/following/get following.js");


const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"chinna",
  password:"chinna4037",
  port:5432,
});

db.connect();


const app=ex();
const port=2000;
const http=HTTP.createServer(app);
const io= new Server(http,{
    cors: {
      origin:  '*',
    }
  });


app.use(cors());
app.use(bodyParser.json());
app.use("/login",login);
app.use("/signup",signup);
app.use("/get",get);
app.use("/getUserData",getUserData);
app.use("/search",search);
app.use("/fg",following);
app.use("/getProfile",getFullProfile);
app.use("/update",update);
app.use("/msg/List",msgList.router);
app.use("/msg/chat",chat.router);
app.use("/msg/history",history);
app.use("/posts",posts);
app.use("/reels",reels);
app.use("/getfollows",getfollows);


app.get('/getusername',async(req,res)=>{
  let uid=req.query.uid;
  try{
    const r1=await db.query("select username from login_credentials where uid=$1",[uid]);
    var username=r1.rows[0].username;
    res.send(username);
  }catch(err){
    console.log(err);
    res.sendStatus(400);
  }
});


http.listen( port, function() {
    console.log( ' backend listening on *:' + port );
});

io.on('connection', (socket) => {
    //console.log(socket.id);

   
    function addRoom(roomId){
      socket.join(roomId);
      console.log("added to rooom id "+roomId);
    }


    chat.getio(addRoom);
    msgList.getio(addRoom);
   
    socket.on("new msg",async (data)=>{
      try{
        user2=data.username;
        msg=data.msg;
        let user1=data.selected;
        const ID=await db.query("select roomid from messages where (user1=$1 AND user2=$2) OR (user1=$2 AND user2=$1)",[user1,user2]);
        const roomid=ID.rows[0].roomid;
        io.to(roomid).emit("rec msg",msg);
        const UID=await db.query("select uid from login_credentials where username=$1",[data.selected]);
        var uid=UID.rows[0].uid;
        io.to(uid).emit("unread",data.username);
      }catch(err){
        console.log(err);
      }
  });
    


  socket.on("setallread",async(data)=>{
    console.log("set all read");
    try{
      const ID=await db.query("select roomid from messages where (user1=$1 AND user2=$2) OR (user1=$2 AND user2=$1)",[data.selected,data.username]);
      const roomid=ID.rows[0].roomid;
      const re=await db.query("select * from messages where roomid=$1",[roomid]);
      if(re.rows[0].data!==null){
        var list=JSON.parse((re.rows[0].data).toString());
        list.reverse();
        for(var i=0;i<list.length;i++){
          // console.log(i+" :-"+list[i]);
          if(list[i].to===data.username){
            if(list[i].seen==true){
              break;
            }
            else{
              list[i].seen=true;
              console.log(list[i]);
            }
          }
        }
        list.reverse();
        // console.log(list);
        var finalData=Buffer.from(JSON.stringify(list));
        await db.query("update messages set data=$1 where roomid=$2",[finalData,roomid]);
      }
    }catch(err){
      console.log(err);
    }
  });



    socket.on("allroom",async (uid)=>{
      
       try{
        socket.join(uid);
        const u=await db.query("select username from login_credentials where uid=$1",[uid]);
        let username=u.rows[0].username;
        console.log("uid "+username);
         var list=await db.query("select roomid from messages where user1=$1 OR user2=$1",[username]);
         for(var i=0;i<list.rows.length;i++){
           socket.join(list.rows[i].roomid);
           console.log("added to rooom id "+list.rows[i].roomid);
         }
       }catch(err){
         console.log(err);
       }
    });

    //socket.emit('joinroom',"room");

    socket.on('disconnect', () => {
        //console.log('Client disconnected:', socket.id);
      });
});

