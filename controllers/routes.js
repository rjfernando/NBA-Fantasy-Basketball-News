const cheerio = require("cheerio");
const axios = require("axios");

module.exports = function (app, db) {

        app.get("/scrape", function (req, res) {

            axios.get("https://www.cbssports.com/fantasy/basketball/players/news/all/").then(function (response) {

                var $ = cheerio.load(response.data);

                $("player-news-desc").each(function (i, element) {

                    var result = {};

                    result.title = $(this).children('h4').text('href');
                    result.link = $(this).children('a').text('href');
                    result.description = $(this).children('latest-update').text('p');
                    result.img = $(this).find('img').text('src');

                    console.log(result.title);


                    if (result.title && result.link && result.description && result.img) {
                        // create a new Article using the `result` object built from scraping
                        db.Recipe.findOne({
                            link: result.link
                        }).then(function (data) {
                            if (!data) {
                                // then creates a new article
                                db.Article
                                    .create(result)
                                    .then(function (dbArticle) {
                                        res.send('Scrape Complete');
                                    })
                                    .catch(function (err) {
                                        res.json(err);
                                    });
                            }

                        });

                    }
                });
                res.redirect('/');
            });
        });
        // Route for getting all Article from the db
        app.get('/', function (req, res) {
            db.Article
                .find({})
                .then(function (data) {
                    var result = {};
                    result.rarticle = data;
                    res.render('index', result);
                });
        });

        // Route for getting all the saved Article from the db
        app.get('/saved-article', function (req, res) {
            db.Article
                .find({
                    saved: true
                })
                .then(function (data) {
                    var result = {};
                    result.article = data;
                    res.render('my-article', result);
                })
        });

        // Route for grabbing a specific Article by id, populate it with its comments
        app.get('/article/:id', function (req, res) {
            var articleId = req.params.id;

            db.Article
                .findOne({
                    _id: articleId
                })
                // runs the populate method with "comments",
                .populate('comment')
                .then(function (data) {
                    res.json(data)
                })
        });

        // Route for saving/updating a Articles associated comments
        app.post('/article/:id', function (req, res) {
            var articleId = req.params.id;
            db.Comment
                .create(req.body)
                .then(function (dbComment) {
                    return db.Comment
                        .findOneAndUpdate({
                            _id: articleId
                        }, {
                            $push: {
                                comment: dbComment._id
                            }
                        }, {
                            new: true
                        })
                        .populate('comments');
                })
                .then(function (dbArticle) {
                    res.json(dbArticle);
                })
        });

        // Route for updating saved prop. for a specific Article
        app.put('/article/:id', function (req, res) {
            var articleId = req.params.id;
            db.Article
                .findOneAndUpdate({
                    _id: articleId
                }, {
                    saved: true
                })
                .then(function (data) {
                    console.log('On Server: comment saved')
                    res.json(data)
                })
        });

        // Route for updating a Saved Article to false
        app.put('/articles/delete/:id', function (req, res) {
            // grabs the specific Article by id
            var articleId = req.params.id;
            db.Article
                .findOneAndUpdate({
                    _id: articleId
                }, {
                    saved: false
                })
                .then(function (data) {
                    console.log('On Server: article deleted')
                    res.json(data)
                })
        });

        // Route for deleting a comment specific to a Artcile
        app.delete('/comment/delete/:id', function (req, res) {
            var commentId = req.params.id;
            db.Comment
                .findOneAndRemove({
                    _id: commentId
                })
                .then(function (data) {
                    console.log('On Server: comment deleted')
                    res.json(data)
                })
        });
    }