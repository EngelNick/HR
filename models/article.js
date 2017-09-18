const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

//title validator
let titleLengthCheker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 3 || title.length > 50) {
        } else {
            return true;
        }
    }
}

const titleValidators = [
    {
        validator: titleLengthCheker,
        message: 'Заголовок должен составлять минимум 3 символа но не более 50'
    }
];

//body validator
let bodyLengthCheker = (body) => {
    if (!body) {
        return false;
    } else {
        if (body.length < 30 || body.length > 5000) {
        } else {
            return true;
        }
    }
}

const bodyValidators = [
    {
        validator: bodyLengthCheker,
        message: 'Новость должна составлять минимум 30 символа но не более 5000'
    }
];

const articleSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    body: { type: String, required: true, validate: bodyValidators },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array }
});

module.exports = mongoose.model('Article', articleSchema);