
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Twit = require('twit');
var userCtrl = require('./components/controllers/userControl.js');
var config = require('./components/config/config.js');
var session = require('express-session');
var passport = require('passport');

require('./passport/passport.js')(passport);

var app = express();
// For login use
app.use(session(config));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/views'));

require('dotenv').config();


var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

app.get('/twitter', function(req, res) {
var keyword = req.params.keyword;

	T.get('search/tweets', { q: '#Orlando since:2016-05-30', count: 5 }, function(err, data, response) {
		if (err) {
			console.log('There was an error retrieving requested data. Msg from: server.js');
		} else {

      var tweetArr = data.statuses.map(function(tweet){

        return {
          text: tweet.text,
          screen_name: tweet.user.screen_name,
          created_at: tweet.created_at,
          profile_img: tweet.user.profile_image_url
        }

      });
      console.log(tweetArr);
      res.send(tweetArr);
    }

	});
});

// Login Information

app.post('/login', passport.authenticate('local-signup'), function(req,res){
  res.redirect('/');
});

//LogOut

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');

  app.use('/static', express.static('static'));
} else {
  // When not in production, enable hot reloading

  var chokidar = require('chokidar');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.dev');
  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));

  // Do "hot-reloading" of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  var watcher = chokidar.watch('./server');
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach(function(id) {
        if (/\/server\//.test(id)) delete require.cache[id];
      });
    });
  });
}

mongoose.connect("mongodb://localhost:27017/gritter");
mongoose.connection.once('open', function(){
	console.log("Connected to your database.");
});

app.get('/', function(req, res){
	res.render('index');
});

app.listen(7000, function(){
	console.log("It's alive on port 7000");
});
