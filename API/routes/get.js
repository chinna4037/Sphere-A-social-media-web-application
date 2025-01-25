const ex=require("express");
const pg=require("pg");
const multer=require("multer");
const path=require("path");
const fs=require("fs");
const uniqid=require('uniqid');

const router=ex.Router();


const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"chinna",
    password:"chinna4037",
    port:5432,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



db.connect();

router.get("/", async (req,res) =>{
     var img=[];
    try{
      const result=await db.query("select * from images where type=$1",["image"]);
      if (result.rows.length === 0) {
        return res.status(404).send('Image not found');
      }
      for(var i=0;i<result.rows.length;i++){
        var x=result.rows[i];
        x={...x,date:((result.rows[i].date).toString()).substring(4,15)};
        x={...x,data:URLgenerator(x.data)};
        var userdata= await getUserDataWithUID(x.uid);
        if(userdata==="error"){
          throw new Error("Incorrect uid");
        }
        else{
          x={...x,...userdata};
        }
        img=[...img,x];
      }
      res.json(img);
    } catch (error) {
      console.error('Error retrieving image:', error);
      res.status(500).send('Error retrieving image');
    } 
})

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { originalname, buffer } = req.file;
      const uid=req.body.uid;
      const type=req.body.type;
      const size=req.body.size;
      var id=uniqid();
      const IDS=await db.query("select imgid from images");
      var listOfIds=[];
      for(var i=0;i<IDS.rows.length;i++){
          listOfIds=[...listOfIds,IDS.rows[i].id];
      }
      while(true){
          if(listOfIds.indexOf(id)==-1){
              break;
          }
          id=uniqid();
      }
      await db.query('INSERT INTO images (uid, data,type,imgid,size) VALUES ($1, $2,$3,$4,$5)', [uid, buffer,type,id,size]);
      res.send('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Error uploading image');
    }
  });

  router.get("/profile", async (req,res) =>{ 
    var buffer;
    fs.readFile("profile.txt", async (err, bufferData) => {
      if (err) {
        console.error('Error reading file:', err);
      } else {
        console.log(bufferData);
        buffer=bufferData;
        try {
          await db.query('INSERT INTO images (name, data) VALUES ($1, $2)', ["profile", buffer]);
          res.send('Image uploaded successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          res.status(500).send('Error uploading image');
        }
      }
    });
    
  });

  module.exports =  router;

async function getUserDataWithUID(x)  {
  try{
      const result=await db.query("select * from user_details where uid=$1",[x]);
      const user=await db.query("select * from login_credentials where uid=$1",[x]); 
  
      if(result.rows.length===0 || user.rows.length===0){
          throw new Error("incorrect uid");
      }

      var r=result.rows[0];
      r={username:user.rows[0].username,...r,profile:URLgenerator(r.profile)};
      return r;
  }
  catch(err){
    return "error";
  }
}

function URLgenerator(x){
  var base64Image = Buffer.from(x, "binary").toString(
    "base64"
  );
  var src = `data:image/jpeg;base64,${base64Image}`; 
  return src;
}