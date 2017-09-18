const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

//title validator
let titleLengthCheker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 3 || title.length > 100) {
        } else {
            return true;
        }
    }
}

const titleValidators = [
    {
        validator: titleLengthCheker,
        message: 'Заголовок должен составлять минимум 3 символа но не более 100'
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
        message: 'Новость должна составлять минимум 30 символов но не более 5000'
    }
];

let urlLengthCheker = (url) => {
        if (url.length > 250) {
        } else {
            return true;
        }
    }

const urlValidators = [
    {
        validator: urlLengthCheker,
        message: 'URL картинки должен составлять не более 250'
    }
];

let hatLengthCheker = (hat) => {
    if (!hat) {
        return false;
    } else {
        if (hat.length < 20 || hat.length > 250) {
        } else {
            return true;
        }
    }
}

const hatValidators = [
    {
        validator: hatLengthCheker,
        message: 'Заголовок должен составлять минимум 20 символов но не более 250'
    }
];

const VacancySchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    url: { type: String, validate: urlValidators},
    hat: { type: String, required: true, validate: hatValidators },
    body: { type: String, required: true, validate: bodyValidators },
    hot: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now() 
    }
});

module.exports = mongoose.model('Vacancy', VacancySchema);