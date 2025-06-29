import mongoose from 'mongoose'

const AudioSchema = new mongoose.Schema({
    name: {
    type: string,
    require: true
    },
    src: {
    type: string,
    require: true
    }
})

