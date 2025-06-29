import express from 'express';
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
const app = express();

// Get the full file URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const audioUploadDir = path.join(__dirname, 'audios');
const multerStorage = multer.diskStorage({
    destination: function(req,file,cb){
    cb(null,audioUploadDir)
    },
    filename: function(req,file,cb){
        console.log(file);
    const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,prefix + '-'+file.originalname);
    }
})

const upload = multer({storage: multerStorage})


app.use('/audios', express.static(audioUploadDir))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'pages/index.html'));

});
app.post('/audio',upload.single('audio-file'),(req,res)=>{
    res.status(200).json({
        message: 'success',
        audio: {
            src: req.file.filename
        }
    })
});


mongoose.connect(process.env.database).then(
()=>{
        console.log('connected to the database');
app.listen(3000,()=>{console.log('listening to port 3000')})
    }
);
