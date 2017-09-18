const Article = require('../models/article');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post(('/newArticle'), (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'Вы не ввели заголовок' });
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: 'Вы не ввели тело статьи' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Необходим автор статьи' });
                } else {
                    const article = new Article({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    article.save((err) => {
                        if (err) {
                            if (err.errors) {
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        res.json({ success: false, message: err.errmsg });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: err });
                            }
                        } else {
                            res.json({ success: true, message: 'Статья успешно сохранена' });
                        }
                    });
                }
            }
    }
    });

router.get('/allArticles', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            if (!articles) {
                res.json({ success: false, message: "К сожалению нет статей" });
            } else {
                res.json({ success: true, articles: articles })
            }
        }
    }).sort({ '_id': -1 });
});

router.get('/singleArticle/:id', (req, res) => {
    if (!req.params.id) {
        res.json({ success: false, message: "_id статьи не предоставлен" });
    } else {
        Article.findOne({ _id: req.params.id }, (err, article) => {
            if (err) {
                res.json({ success: false, message: "Неправиьный _id статьи" });
            } else {
                if (!article) {
                    res.json({ success: false, message: "Такой статьи к сожалению нет" });
                } else {
                    res.json({ success: true, article: article });
                }
            }
        })
    }
});

router.put('/updateArticle', (req, res) => {
    if (!req.body._id) {
        res.json({ success: false, message: "_id статьи не предоставлен" });
    } else {
        Article.findOne({ _id: req.body._id }, (err, article) => {
            if (err) {
                res.json({ success: false, message: "Неправиьный _id статьи" });
            } else {
                if (!article) {
                    res.json({ success: false, message: "Такой статьи к сожалению нет" });
                } else {
                    article.title = req.body.title;
                    article.body = req.body.body;
                    article.save((err) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: "Статья успешно отредактирована" });
                        }
                    })
                }
            }
        })
    }
})

router.delete('/deleteArticle/:id', (req, res) => {
    if (!req.params.id) {
        res.json({ success: false, message: "_id статьи не предоставлен" });
    } else {
        Article.findOne({ _id: req.params.id }, (err, article) => {
            if (err) {
                res.json({ success: false, message: "Неправиьный _id статьи" });
            } else {
                if (!article) {
                    res.json({ success: false, message: "Такой статьи к сожалению нет" });
                } else {
                    article.remove((err) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: "Статья успешно удалена" });
                        }
                    });
                }
            }
        })
    }
});

return router;
};