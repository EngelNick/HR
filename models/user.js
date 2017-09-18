const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


//Валидатор длины почты
let emailLengthChecker = (email) => {
    if(!email) {
        return false;
    } else {
        if(email.length <5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

// Валидатор почты. Проверка на соответствие
 let validEmailChecker = (email) => { 
     if (!email) {
         return false;
     } else {
         const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
     }
}

// Массив валидаторов почты
const emailValidators = [
    {
        validator: emailLengthChecker, 
        message: 'Эл.почта должна состоять минимум из 5 символов но не более 30'
    },
    {
        validator: validEmailChecker, 
        message: 'Неправильный формат электронной почты'
    }
];

//Валидатор длины имени пользователя
let userNameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    }
}

// Валидатор имени пользователя на соответствие
let validUserName = (username) => {
    if(!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

// Массив валидаторов имени
const userNameValidators = [
    {
        validator: userNameLengthChecker, 
        message: 'Имя пользователя должно состоять минимум из 3 символов но не более 15'
    },
    {
        validator: validUserName, 
        message: 'Неправильный формат имени пользователя'
    }
];

//Валидатор длины пароля
let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else {
        if (password.length < 6 || password.length > 30) {
            return false;
        } else {
            return true;
        }
    }
}

// Валидатор пароля пользователя на соответствие
let validPassword = (password) => {
    if(!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/);
        return regExp.test(password);
    }
};

// Массив валидаторов пароля
const passwordValidators = [
    {
        validator: passwordLengthChecker, 
        message: 'Пароль должен состоять минимум из 6 символов но не более 30'
    },
    {
        validator: validPassword, 
        message: 'Пароль должен содержать минимум 1 букву и 1 цифру'
    }
];


// Схема пользователя
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, validate: userNameValidators },
    password: { type: String, required: true, validate: passwordValidators},
    admin: { type: Boolean }
});

// Перед тем как сохранить пользователя необходимо закодировать пароль
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) 
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    })
});

// Сравнение паролей 
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema); 