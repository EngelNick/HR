const News = require('../models/news');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post(('/newnews'), (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'Вы не ввели заголовок' });
        } else {
            if (!req.body.url) {
                res.json({ success: false, message: 'Вы не ввели url картинки' });
            } else {
                if (!req.body.hat) {
                    res.json({ success: false, message: 'Вы не ввели заголовок для основной страницы' });
                } else {
                    if (!req.body.body) {
                        res.json({ success: false, message: 'Вы не ввели тело новости' });
                    } else {
                        if (!req.body.createdBy) {
                            res.json({ success: false, message: 'Необходим автор новости' });
                        } else {
                            const news = new News({
                                title: req.body.title,
                                url: req.body.url,
                                hat: req.body.hat,
                                body: req.body.body,
                                createdBy: req.body.createdBy
                            });
                            news.save((err) => {
                                if (err) {
                                    if (err.errors) {
                                        if (err.errors.title) {
                                            res.json({ success: false, message: err.errors.title.message });
                                        } else {
                                            if (err.errors.url) {
                                                res.json({ success: false, message: err.errors.url.message });
                                            } else {
                                                if (err.errors.hat) {
                                                    res.json({ success: false, message: err.errors.hat.message });
                                                } else {
                                                    if (err.errors.body) {
                                                        res.json({ success: false, message: err.errors.body.message });
                                                    } else {
                                                        res.json({ success: false, message: err.errmsg });
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        res.json({ success: false, message: err });
                                    }
                                } else {
                                    res.json({ success: true, message: 'Новость успешно сохранена' });
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    router.get('/allnews', (req, res) => {
        News.find({}, (err, news) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!news) {
                    res.json({ success: false, message: "К сожалению нет новостей" });
                } else {
                    res.json({ success: true, news: news })
                }
            }
        }).sort({ '_id': -1 });
    });

    router.get('/getTwelveNews/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: "_id не предоставлен" });
        } else {
            News.find({}, (err, news) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!news) {
                        res.json({ success: false, message: "К сожалению нет новостей" });
                    } else {
                        res.json({ success: true, news: news })
                    }
                }
            }).sort({ '_id': -1 }).limit(req.params.id * 12);
        }
    });

    router.get('/singleNews/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: "_id новости не предоставлен" });
        } else {
            News.findOne({ _id: req.params.id }, (err, news) => {
                if (err) {
                    res.json({ success: false, message: "Неправиьный _id новости" });
                } else {
                    if (!news) {
                        res.json({ success: false, message: "Такой новости к сожалению нет" });
                    } else {
                        res.json({ success: true, news: news });
                    }
                }
            })
        }
    });

    router.put('/updateNews', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: "_id новости не предоставлен" });
        } else {
            News.findOne({ _id: req.body._id }, (err, news) => {
                if (err) {
                    res.json({ success: false, message: "Неправиьный _id новости" });
                } else {
                    if (!news) {
                        res.json({ success: false, message: "Такой новости к сожалению нет" });
                    } else {
                        news.title = req.body.title;
                        news.url = req.body.url;
                        news.hat = req.body.hat;
                        news.body = req.body.body;
                        news.save((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: "Новость успешно отредактирована" });
                            }
                        })
                    }
                }
            })
        }
    })

    router.delete('/deleteNews/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: "_id новости не предоставлен" });
        } else {
            News.findOne({ _id: req.params.id }, (err, news) => {
                if (err) {
                    res.json({ success: false, message: "Неправиьный _id новости" });
                } else {
                    if (!news) {
                        res.json({ success: false, message: "Такой новости к сожалению нет" });
                    } else {
                        news.remove((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: "Новость успешно удалена" });
                            }
                        });
                    }
                }
            })
        }
    });

    return router;
};