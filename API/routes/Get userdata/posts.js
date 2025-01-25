const ex=require("express");
const pg=require("pg");
const router=ex.Router();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
console.log(typeof(ffmpegPath));
// ffmpeg.setFfmpegPath(ffmpegPath);


const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"chinna",
    password:"chinna4037",
    port:5432,
});

db.connect();


router.get('/',async(req,res)=>{
    console.log("POSTS");
    try{
        let uid=req.query.uid;
        //console.log(uid);
        const result=await db.query("select * from images where uid=$1",[uid]);
        r=result.rows;
        for(var i=0;i<r.length;i++){
            if(r[i].type==="video"){
                console.log("video");
                var base64Image = Buffer.from(r[i].data, "binary").toString(
                    "base64"
                );
                var src = `data:video/mp4;base64,${base64Image}`;
                r[i]={...r[i],data:src};
                //   ffmpeg(src)
                //   .seekInput(1)  // Seek to the desired time (2 seconds)
                //   .frames(1)     // Capture one frame (snapshot)
                //   .output('pipe:1') // Output to stdout
                //   .on('end', (stdout) => {
                //       // Convert the stdout buffer to a base64-encoded data URL
                //       const base64Data = Buffer.from(stdout).toString('base64');
                //       const dataUrl = `data:image/jpeg;base64,${base64Data}`;
                //       console.log('Snapshot captured successfully:', dataUrl);
              
                //       // Now you can use the data URL as needed (store it in a variable, etc.)
                //       // For example:
                //       // const snapshotUrl = dataUrl;
                //   })
                //   .on('error', (err) => {
                //       console.error('Error capturing snapshot:', err);
                //   })
                //   .run();
            }
            else{
                r[i]={...r[i],data:URLgenerator(r[i].data)};
            }
            delete r[i].uid;
            delete r[i].size;
            delete r[i].imgid;
        }
        //console.log(r);
        res.send(r);

    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});


module.exports =  router;


function URLgenerator(x){
    var base64Image = Buffer.from(x, "binary").toString(
      "base64"
    );
    var src = `data:image/jpeg;base64,${base64Image}`; 
    return src;
}