const User = require('../models/user');
const News = require('../models/news');
const Article = require('../models/article');
const Vacancy = require('../models/vacancy');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 7000,
  auth: {
    user: 'helper.bot8@gmail.com',
    pass: 'engel165'
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: "Вы не предоставили эл.почту" });
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: "Вы не предоставили имя пользователя" });
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: "Вы не ввели пароль" });
                } else {
                    let user = new User({
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        admin: false
                    });
                    user.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.json({ success: false, message: "Пользователь с таким Именем или почтой уже существует" });
                            } else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message });
                                    } else {
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message });
                                        } else {
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message });
                                            } else {
                                                res.json({ success: false, message: "Невозможно сохранить пользователя, Ошибка: ", err });
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            res.json({ success: true, message: "Пользователь успешно сохранен" });

                            
                            let HelperOptions = {
                                from: '"Nikolay" <helper.bot8@gmail.com',
                                to: req.body.email,
                                subject: 'Большое спасибо за регистрацию!',
                                text: "Добрый день. \nБольшое спасибо, Вам, за регистрацию." +
                                "На данном этапе регистрация дает лишь возможность лайкать понравившиеся новости."
                                +"\nПожалуйста сохраните данное письмо т.к. оно поможет Вам вспомнить пароль или логин в случае утраты."
                                +"\nВаш логин: " + req.body.username + 
                                "\nВаш пароль: " + req.body.password +
                                "\n\n\nУдачи в Ваших начинаниях." +
                                "\nС Уважением, администрация сайта."
                              };

                            transporter.sendMail(HelperOptions, (error, info) => {
                                if (error) {
                                  return console.log(error);
                                }
                              });
                        }
                    });
                }
            }
        }
    });

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({ success: false, message: 'Эл.почта не предоставлена' });
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Электронная почта уже занята' });
                    } else {
                        res.json({ success: true, message: 'Эл.почта доступна' });
                    }
                }
            });
        }
    });

    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'Имя пользоватея не предоставлено' });
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Имя пользователя уже занято' });
                    } else {
                        res.json({ success: true, message: 'Имя пользователя доступно' });
                    }
                }
            });
        }
    });
    
    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'Имя пользователя не предоставлено' });
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'Пароль не предоставлен' });
            } else {
                User.findOne({ username: req.body.username }, (err, user) => {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        if (!user) {
                            res.json({ success: false, message: 'Такого пользователя не существует' });
                        } else {
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword) {
                                res.json({ success: false, message: 'Пароль не совпадает проверьте правильность набора' });
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                                res.json({ success: true, message: "Вы успешно зашли!", token: token, user: { username: user.username } });
                            }
                        }
                    }
                });
            }
        }
    });
    
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'Токен не предоставлен' });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Некорректный токен ' + err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email admin').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Такого пользователя не существует' });
                } else {
                    res.json({ success: true, user: user });
                }
            }
        });
    });

    router.get('/adminCheck', (req, res) => {
            User.findOne({ _id: req.decoded.userId }).select('admin').exec((err, user) => {
             if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Такого пользователя не существует' });
                } else {
                    res.json({ success: true, user: user });
                }
            }
        });
    });

    
    router.put('/likeNews', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: "_id новости не предоставлен" });
        } else {
            News.findOne({ _id: req.body.id }, (err, news) => {
                if (err) {
                    res.json({ success: false, message: "Неправиьный _id новости" });
                } else {
                    if (!news) {
                        res.json({ success: false, message: "Такой новости к сожалению нет" });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: "Что-то пошло не так" });
                            } else {
                                if (news.likedBy.includes(user.username)) {
                                    news.likes--;
                                    const arrayIndex = news.likedBy.indexOf(user.username);
                                    news.likedBy.splice(arrayIndex, 1);
                                    news.save((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err });
                                        } else {
                                            res.json({ success: false, message: "Вы сняли пометку Понравилось" });
                                        }
                                    });
                                } else {
                                    news.likes++;
                                    news.likedBy.push(user.username);
                                    news.save((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err });
                                        } else {
                                            res.json({ success: false, message: "Спасибо за лайк " + user.username + " !" });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    router.put('/likeArticle', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: "_id статьи не предоставлен" });
        } else {
            Article.findOne({ _id: req.body.id }, (err, article) => {
                if (err) {
                    res.json({ success: false, message: "Неправиьный _id статьи" });
                } else {
                    if (!article) {
                        res.json({ success: false, message: "Такой статьи к сожалению нет" });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: "Что-то пошло не так" });
                            } else {
                                if (article.likedBy.includes(user.username)) {
                                    article.likes--;
                                    const arrayIndex = article.likedBy.indexOf(user.username);
                                    article.likedBy.splice(arrayIndex, 1);
                                    article.save((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err });
                                        } else {
                                            res.json({ success: false, message: "Вы сняли пометку Понравилось" });
                                        }
                                    });
                                } else {
                                    article.likes++;
                                    article.likedBy.push(user.username);
                                    article.save((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err });
                                        } else {
                                            res.json({ success: false, message: "Спасибо за лайк " + user.username + " !" });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    return router;
}