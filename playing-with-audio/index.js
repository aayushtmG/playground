import express from 'express';
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Audio from './models/Audio.js'

dotenv.config();
const app = express();
app.set('view engine', 'pug')

// Get the full file URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const audioUploadDir = path.join(__dirname, 'audios');
const multerStorage = multer.diskStorage({
    destination: function(req,file,cb){
    cb(null,audioUploadDir)
    },
    filename: function(req,file,cb){
    const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,prefix + '-'+file.originalname);
    }
})

const upload = multer({storage: multerStorage})


app.use('/audios', express.static(audioUploadDir))

app.get('/',async (req,res)=>{
    const audioList = await Audio.find(); 
    res.render('index',{title: 'Home Page',message: 'Working With Pug engine',audioList: audioList});
});
app.post('/audio',upload.single('audio-file'),async(req,res)=>{
    const {originalname, filename} = req.file;
    const newAudio =  await Audio.create({
        name: originalname,
        src: filename
    })
    if(newAudio){
        console.log(newAudio)
        res.redirect('/');
    }else{
        res.status(401).json({
            message: 'Audio creation failed'})
    }
});


mongoose.connect(process.env.database).then(
()=>{
        console.log('connected to the database');
app.listen(3000,()=>{console.log('listening to port 3000')})
    }
);
