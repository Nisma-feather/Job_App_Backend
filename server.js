const express=require("express");
const cors=require("cors");
const multer=require("multer");
const path = require("path");
const {v4:uuidv4} =require("uuid")
require("dotenv").config();

const app=express();
app.use(cors());
app.use(express.json());
const uploadDir = path.join(__dirname, "uploads");

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadDir));

const storage=multer.diskStorage({
    destination:"./uploads/",
    filename:(req,file,cb)=>{
        const date = new Date().toISOString().split('T')[0];
    const uniqueId = uuidv4(); // Generates UUID
    const ext = path.extname(file.originalname);
    cb(null, `${date}_${uniqueId}${ext}`);
    },
});
const upload=multer({storage})

app.post("/upload", upload.single("file"),(req,res)=>{
    if(!req.file) return res.status(400).json({message:"file not found"})
    const fileUrl= `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({ message: "File uploaded", url: fileUrl })
})
app.get("/test",(req,res)=>{
    res.json({message:"test successfull"})

})
const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
})
