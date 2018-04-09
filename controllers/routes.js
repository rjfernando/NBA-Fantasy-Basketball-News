const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app, db) {

    app.get("/scrape", function (req, res) {

        axios.get("https://www.cbssports.com/fantasy/basketball/players/news/all/").then(function (response) {

            var $ = cheerio.load(response.data);

            $("player-news-desc").each(function (i, element) {
                console.log("player-news-desc");
                var result = {};

                results.title = $(this).children("h4").text();
                results.URL = "https://www.cbssports.com" + $(this).children("a").text("href");
                results.summary = $(this).children("p").text();
                console.log(results);

                db.Article.create(results).then(function (dbArticle) {
                        console.log(dbArticle);

                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });


            res.send("Scraped!");
        });
    });
};

// // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function(dbArticle) {
//         var result = {};
//         result.article = data;
//         res.render("index", result);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });
