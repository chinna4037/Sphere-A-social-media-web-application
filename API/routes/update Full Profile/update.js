const ex=require("express");
const pg=require("pg");
const multer=require("multer");

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


router.post('/profile', upload.single('image'), async (req, res) => {
    try{
        const { originalname, buffer } = req.file;
        const uid=req.body.uid;
        await db.query("update user_details set profile=$1 where uid=$2",[buffer,uid]);
        res.send('Image uploaded successfully');
    }
    catch(err){
        console.log(err)
        res.sendStatus(400);
    }
});

module.exports =  router;