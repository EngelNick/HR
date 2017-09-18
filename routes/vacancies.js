const Vacancy = require('../models/vacancy');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post(('/newvacancy'), (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'Вы не ввели заголовок' });
        } else {
                if (!req.body.hat) {
                    res.json({ success: false, message: 'Вы не ввели заголовок для основной страницы' });
                } else {
                    if (!req.body.body) {
                        res.json({ success: false, message: 'Вы не ввели тело вакансии' });
                    } else {
                        if (!req.body.hot) {
                            res.json({ success: false, message: 'Необходим знать вакансия горящая или нет' });
                        } else {
                            const vacancy = new Vacancy({
                                title: req.body.title,
                                url: req.body.url,
                                hat: req.body.hat,
                                body: req.body.body,
                                hot: req.body.hot
                            });
                            vacancy.save((err) => {
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
                                    res.json({ success: true, message: 'Вакансия успешно сохранена' });
                                }
                            });
                        }
                    }
                }
            
        }
    });

    router.get('/allvacancies', (req, res) => {
        Vacancy.find({}, (err, vacancies) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!vacancies) {
                    res.json({ success: false, message: "К сожалению нет такой вакансии" });
                } else {
                    res.json({ success: true, vacancies: vacancies })
                }
            }
        }).sort({ '_id': -1 });
    });

    router.get('/singleVacancy/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: "_id вакансии не предоставлен" });
        } else {
            Vacancy.findOne({ _id: req.params.id }, (err, vacancy) => {
                if (err) {
                    res.json({ success: false, message: "Неправильный _id вакансии" });
                } else {
                    if (!vacancy) {
                        res.json({ success: false, message: "Такой вакансии к сожалению нет" });
                    } else {
                        res.json({ success: true, vacancy: vacancy });
                    }
                }
            })
        }
    });

    router.put('/updateVacancy', (req, res) => {
        if (!req.body._id) {
            res.json({ success: false, message: "_id вакансии не предоставлен" });
        } else {
            Vacancy.findOne({ _id: req.body._id }, (err, vacancy) => {
                if (err) {
                    res.json({ success: false, message: "Неправильный _id вакансии" });
                } else {
                    if (!vacancy) {
                        res.json({ success: false, message: "Такой вакансии к сожалению нет" });
                    } else {
                        vacancy.title = req.body.title;
                        vacancy.url = req.body.url;
                        vacancy.hat = req.body.hat;
                        vacancy.body = req.body.body;
                        vacancy.hot = req.body.hot;
                        vacancy.save((err) => {
                            if (err) {
                                res.json({ success: false, message: err });
                            } else {
                                res.json({ success: true, message: "Вакансия успешно отредактирована" });
                            }
                        })
                    }
                }
            })
        }
    })

router.delete('/deleteVacancy/:id', (req, res) => {
    if (!req.params.id) {
        res.json({ success: false, message: "_id вакансии не предоставлен" });
    } else {
        Vacancy.findOne({ _id: req.params.id }, (err, vacancy) => {
            if (err) {
                res.json({ success: false, message: "Неправиьный _id вакансии" });
            } else {
                if (!vacancy) {
                    res.json({ success: false, message: "Такой вакансии к сожалению нет" });
                } else {
                    vacancy.remove((err) => {
                        if(err) {
                            res.json({ success: false, message: err });
                        } else {
                            res.json({ success: true, message: "Вакасия успешно удалена" });
                        }
                    });
                }
            }
        })
    }
});

return router;
};