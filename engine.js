const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const curl = require('curl');

//cors options
var corsOptions = { origin: ['http://localhost:3000', 'https://jiloo.netlify.app'], optionsSuccessStatus: 200 }

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(helmet());

//sending the request to google's Algorithm 
const middleware = (req, res, next) => {
    
    let qry = req.query.qry;
    qry = qry.toString().split(' '); let search = "";
    console.log(qry)
    qry.forEach(q => {
        search += (search != "")? ("&") : "";
        search += q;
    });

    //
    let url = 'https://serpapi.com/search.json?q='+ qry +'&location=Austin,+Texas,+United+States&hl=en&gl=us&google_domain=google.com&api_key=eb6f1e6b6195c167fff043cc878debe360bd132e8ea403ea6e3028a0186b3ab0';
    let options = {} 
    curl.getJSON(url, options, function(err, response, body) {
        if (err) { console.log(err); return }
        req.result = body;
        next();
    });
};
//get route
app.post('/search', middleware, (req, res) => {
    console.log(req.query);
    res.send(req.result);
});
//sending the request to google's Algorithm 
const middleware_direct = (req, res, next) => {
    
    let qry = req.query.qry;
    
    let qry_ = qry.split(','), final_str = "";
    qry_.forEach(qry__ => {
        let sep = "%2C";
        final_str += (final_str == "") ? qry__ : sep + qry__;
    });
    let uri = `${final_str}&start=${req.query.start}`;
    console.log(uri);
    let url = 'https://serpapi.com/search.json?location=Austin,+Texas,+United+States&hl=en&gl=us&google_domain=google.com&api_key=eb6f1e6b6195c167fff043cc878debe360bd132e8ea403ea6e3028a0186b3ab0&q='+ uri;
    let options = {} 
    curl.getJSON(url, options, function(err, response, body) {
        if (err) { console.log(err); return }
        req.result = body;
        next();
    });
};
//direct
app.post('/search/direct', middleware_direct, (req, res) => {
    console.log(req.query);
    res.send(req.result);
});

app.get("/", (req, res) => {
    res.send(`Server listening on port ${port}`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});