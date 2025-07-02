import mongoose from 'mongoose'

const AudioSchema = new mongoose.Schema({
    name: {
    type: String,
    require: true
    },
    src: {
    type: String,
    require: true
    }
})

const Audio = mongoose.model('Audio',AudioSchema);
export default Audio;
