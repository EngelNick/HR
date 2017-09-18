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

let urlLengthCheker = (url) => {
    if (!url) {
        return false;
    } else {
        if (url.length < 3 || url.length > 100) {
        } else {
            return true;
        }
    }
}

const urlValidators = [
    {
        validator: urlLengthCheker,
        message: 'URL картинки должен составлять минимум 3 символов но не более 100'
    }
];

let hatLengthCheker = (hat) => {
    if (!hat) {
        return false;
    } else {
        if (hat.length < 100 || hat.length > 250) {
        } else {
            return true;
        }
    }
}

const hatValidators = [
    {
        validator: hatLengthCheker,
        message: 'Заголовок должен составлять минимум 100 символов но не более 250'
    }
];



const newsSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    url: { type: String, required: true, validate: urlValidators},
    hat: { type: String, required: true, validate: hatValidators },
    body: { type: String, required: true, validate: bodyValidators },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array }
});

module.exports = mongoose.model('News', newsSchema);