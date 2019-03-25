const express = require("express");
const router = express.Router();
//const NewsAPI = require("newsapi");
//const newsapi = new NewsAPI(process.env.apiKey);

const axios = require("axios");

const getUrls = stories => {
  const urlArr = [];

  stories.data.slice(0, 200).forEach(hnID => {
    urlArr.push(`https://hacker-news.firebaseio.com/v0/item/${hnID}.json`);
  });

  return urlArr;
}

const getStory = (url, term) => {
  const response = axios.get(url).then(response => {
    let containsTerm = undefined;
    let searchTerms = ["java",
      "object-orientated",
      "js ",
      "python",
      "haskell",
      "swift",
      "ruby",
      "sql",
      "kotlin",
      "programming",
      "software"
    ];
    if (term) searchTerms = [term];

    for (let i = 0; i < searchTerms.length; i++) {
      containsTerm = response.data.title
        .toLowerCase()
        .includes(searchTerms[i]);
      if (containsTerm) break;
    }

    if (
      response.data.type === "story" &&
      response.data.url !== undefined &&
      containsTerm
    ) {
      const article = {
        title: response.data.title,
        url: response.data.url,
        date: response.data.time,
        text: response.data.text,
        id: response.data.id
      };
      // console.log("ARTICLEEEEEEE", article)
      return article;
    }
    else {
      return null;
    }
  }).catch(error => console.log('error', 'error'));

  return response;
}

const getHackerNewsNewArticles = searchTerm => {
  return axios
    .get(`https://hacker-news.firebaseio.com/v0/newstories.json`)
    .then(res => {
      // let searchTerms = ["java",
      //   "object-orientated",
      //   "js ",
      //   "python",
      //   "haskell",
      //   "swift",
      //   "ruby",
      //   "sql",
      //   "kotlin",
      //   "programming",
      //   "software"
      // ];
      // if (searchTerm) searchTerms = [searchTerm];

      // this is being done programmatically now
      // const searchTerms = [
      //   "java",
      //   "object",
      //   "js",
      //   "python",
      //   "ruby",
      //   "sql",
      //   "kotlin",
      //   "programming"
      // ];

      const stroriesArray = getUrls(res);
      const requests = stroriesArray.map(url => getStory(url, searchTerm));

      return Promise.all(requests);

      // const requests = stroriesArray.map(url => {
      //   return axios.get(url).then(response => {
      //     let containsTerm = undefined;
      //     for (let i = 0; i < searchTerms.length; i++) {
      //       containsTerm = response.data.title
      //         .toLowerCase()
      //         .includes(searchTerms[i]);
      //       if (containsTerm) break;
      //     }
      //     if (
      //       response.data.type === "story" &&
      //       response.data.url !== undefined &&
      //       containsTerm
      //     ) {
      //       const article = {
      //         title: response.data.title,
      //         url: response.data.url,
      //         date: response.data.time,
      //         text: response.data.text,
      //         id: response.data.id
      //       };
      //       console.log("ARTICLEEEEEEE", article)
      //       return article;
      //     }
      //     else {
      //       return null;
      //     }
      //   }).catch(error => console.log('error', error));
      // });

      // return Promise.all(requests);
    });
};

//Using NewsAPI - largely works! Needs npm install newsapi --save (see https://newsapi.org/docs/client-libraries/node-js) - at the moment can't select the data from it
// newsapi.v2.everything({
//   q: ['javascript', 'ruby', 'kotlin', 'python', 'programming', 'ruby on rails', 'sql', 'PHP'],
//   from: '2019-03-01',
//   to: '2019-12-12',
//   language: 'en',
//   sortBy: 'relevancy',
//   page: 2
// }).then(response => {

//   let i = undefined;
//   response.articles.forEach(NAPIin => {
//     i = (NAPIin - 1)
//   });

//   const news = {
//     title: response.articles[i].title,
//     url: response.articles[i].url,
//   }
//   console.log(news);
// });

/* GET home page */

// router.get("/asd", (req, res, next) => {
//   res.json("I'm rendering!")
// });

router.get("/api/stories", (req, res, next) => {
  getHackerNewsNewArticles().then(articles => {
    console.log("test", articles);
    return res.json(articles.filter(a => a !== null));
  });
});


router.get("/api/stories/:searchTerm", (req, res, next) => {
  getHackerNewsNewArticles(req.params.searchTerm).then(articles => {
    console.log("test", articles);
    res.json(articles.filter(a => a !== null));
  });
});

router.get("/user/collections", (req, res, next) => {
  res.json([
    { name: "ruby", articles: [123, 234, 345] }
  ])
  // res.json(req.user.collections)
});

module.exports = router;
