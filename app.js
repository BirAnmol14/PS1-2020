//jshint esversion:6
const express = require('express');
const app = express();
const ejs = require("ejs");
const parser = require('body-parser');
const secrets = require('./secrets.js');
const func = require('./functions.js');
const md5 = require('md5');
const session = require('express-session');
const https = require("https");
const passPhrase = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sapien urna, placerat ut erat eget, vehicula vestibulum quam. Quisque vitae ante quis purus eleifend dapibus. Suspendisse potenti. Donec ut ex quis purus pellentesque varius. Aenean eu velit nam.';
const CryptoJS = require('crypto-js');

const home = '/chat';

const feedback = '/feedback';
const about = '/about';
const FAQ = '/FAQ';
const Terms = '/Terms';
const privacy = '/privacy';
const blog = '/blog';
const logout = '/logout';
const project = '/project';
const profile = '/profile';
const badges = '/badges';


app.set('views', './public/views');
app.set('view engine', 'ejs');
app.use(parser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(session({
  secret: secrets.string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10*24*60 * 60 * 1000
  }
}));

//Starting local server
app.listen(3000, function (req, res) {
  console.log('Server Started on localhost:3000');
});


//Routing
app.get('/register', function (req, res) {
  let user = req.session.user;
  if (user) {
    res.redirect('/home');
  } else {
    res.render('register.ejs', {
      status: ''
    });
  }
});

app.post('/register', function (req, res) {
  let user = req.session.user;
  if (user) {
    res.redirect(home);
    return;
  } else {
    if (req.body.hasOwnProperty('signup')) {
      var key = passPhrase;
      var bytes = CryptoJS.AES.decrypt(req.body.pass1, key);
      req.body.pass1 = bytes.toString(CryptoJS.enc.Utf8);

      if (req.body.pass1.length < 10) {
        res.render('register.ejs', { status: 'Password should be atleast 10 characters long' });
      }
      else {
        var new_user = new func.getUser(req.body.email, req.body.pass1, req.body.name, req.body.username1, req.body.identity);
        func.addNewUser(req, res, new_user.name, new_user.email, new_user.password, new_user.userName, new_user.identity);
      }
    } else if (req.body.hasOwnProperty('login')) {

      var key1 = passPhrase;
      var bytes1 = CryptoJS.AES.decrypt(req.body.pass2, key1);
      req.body.pass2 = bytes1.toString(CryptoJS.enc.Utf8);

      var curr_user = func.resetCurrUser();
      curr_user.userName = req.body.username2;
      curr_user.password = req.body.pass2;
      func.verifyUser(req, res, curr_user.userName, curr_user.password);
    } else if (req.body.hasOwnProperty('forgot')) {
      res.send('forgot password page');
    } else {
      res.send('Error Occured');
    }
  }
});
app.get('/home', (req, res) => {
  res.redirect('/chat');
});
app.get('/chat', function (req, res) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let curr_user = req.session.user;
  if (curr_user) {
    res.render('home.ejs', {
      home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, curr_user: curr_user,url:secrets.url
    });
  } else {
    res.redirect('/register');
  }
});


app.post('/chat', function (req, res) {
  let user = req.session.user;
  //console.log(req.body);

  if (req.body.hasOwnProperty('search_button')) {
    res.redirect('/search?text=' + req.body.search_text);
  }
});
app.post('/search_site', function (req, res) {
  //console.log(req.body);

  if (req.body.hasOwnProperty('search_button')) {
    res.redirect('/search?text=' + req.body.search_text);
  }
});

app.get('/search', (req, res) => {

  func.search(req.query.text, res);

});
app.get('/find', (req, res) => {
  if (req.session.user) {
    var text = req.query.text;
    var url = secrets.url + "/search/query?term=" + text + "&include_blurbs=true";
    var options = {
      method: 'GET',
      headers: {
        'Api-Key': secrets.key,
        'Api-Username': 'system',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Discourse-Visible': true,
        'DNT': 1,
        'Referer': secrets.url,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Mobile Safari/537.36',
        'X-CSRF-Token': 'undefined',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    https.get(url, options, function (response) {
      var body = '';

      response.on('data', function (data) {
        body += data;

      });
      response.on('end', function () {
        body = JSON.parse(body);
        if (body.grouped_search_result && body.grouped_search_result.user_ids) {
          res.json(body.users);
        } else {
          res.json([]);
        }
      });
    }).on('error', function () {
      console.log('error');
    });
  } else {
    res.redirect('/');
  }
});



app.get("/feedback", function (req, res) {
  let curr_user = req.session.user;
  if (curr_user) {
    res.render('feedback.ejs', {
      curr_user: curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile
    });
  } else {
    res.render('feedback.ejs', {
      curr_user: curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile
    });
  }
});


app.get("/about", function (req, res) {
  let curr_user = req.session.user;
  var body3 = '';
  var url2 = secrets.url+"about.json";
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      if (curr_user) {
        res.render("about.ejs", { abouts: body3, curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout,url:secrets.url });
      } else {
        res.render("about.ejs", { abouts: body3, curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout,url:secrets.url });
      }
    });
  });
});

app.get("/blog", function (req, res) {
  let curr_user = req.session.user;
  var body3 = '';
  var url2 = secrets.url+"c/blogs/11.json";
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      var projects = body3.topic_list.topics;
      if (curr_user) {
        res.render("blog.ejs", { projects: projects, curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
      } else {
        res.render("blog.ejs", { projects: projects, curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
      }
    });
  });
});

app.get("/project", function (req, res) {
  let curr_user = req.session.user;
  var body3 = '';
  var url2 = secrets.url+"c/projects/17/l/latest.json?page=0";
  // console.log(url2);
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      //console.log(body3.topic_list);
      var projects = body3.topic_list;
      if (curr_user) {
        res.render("project.ejs", { projects: projects, curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
      } else {
        res.render("project.ejs", { projects: projects, curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
      }
    });

  });
});
app.get("/project/more/:offset", function (req, res) {
  let curr_user = req.session.user;
  var body3 = '';
  var url2 = secrets.url+"/c/projects/17/l/latest.json?page=" + req.params.offset;
  //  console.log(url2);
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      //    console.log(body3.topic_list);
      var projects = body3.topic_list;
      res.json(projects);
    });

  });
});





app.get("/FAQ", function (req, res) {
  let curr_user = req.session.user;
  if (curr_user) {
    res.render("FAQ.ejs", { curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
  } else {

    res.render("FAQ.ejs", { curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
  }
});
app.get("/Terms", function (req, res) {
  let curr_user = req.session.user;
  if (curr_user) {
    res.render("Terms.ejs", { curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
  } else {
    res.render("Terms.ejs", { curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
  }
});
app.get("/privacy", function (req, res) {
  let curr_user = req.session.user;
  if (curr_user) {
    res.render("privacy.ejs", { curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
  } else {
    res.render("privacy.ejs", { curr_user: curr_user, home: home, about: about, blog: blog, project: project, FAQ: FAQ, profile: profile, Terms: Terms, privacy: privacy, feedback: feedback, logout: logout });
  }
});

app.post("/feedback", function (req, res) {

  var type = req.body.options;
  var topic = req.body.topic;
  var desc = req.body.desc;
  var rate = req.body.ratings;
  // console.log(req.body);
  res.send(type + " " + topic + " " + desc + " " + rate);
  //res.send(req.body.topic+" "+req.body.desc+" "+res.body.options);
});


app.get("/profile", function (req, res) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let curr_user = req.session.user;

  if (curr_user) {
    var obj = { curr_user: curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout,url:secrets.url };
    func.request_summary(res, obj, 'curr_profile');
  } else {
    res.redirect('/register');
  }
});

app.get("/badges", function (req, res) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let curr_user = req.session.user;
  if (curr_user) {
    var obj = { curr_user: curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout,url:secrets.url };
    func.showBadges(res, obj);
  } else {
    res.redirect('/register');
  }
});


app.get('/logout', function (req, res) {
  let user = req.session.user;
  if (user) {
    req.session.cookie.maxAge = -1;
    req.session.destroy();
    req.session = null;
    res.redirect('/');
  }else{
      res.redirect('/');
  }
});

//NEWLY_ADDED
app.get("/", function (req, res) {
  let curr_user = req.session.user;
  // res.render("groups.ejs",{
  //   home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
  func.fetchGroups(req, res, home, about, blog, project, feedback, logout, profile, curr_user);
});



app.get("/group/:topic/:id", function (req, res) {
  let curr_user = req.session.user;
  var topic = req.params.topic;
  var id = req.params.id;
  func.fetch_Group(req, res, home, about, blog, project, feedback, logout, profile, topic, id, curr_user);
  // res.render("group",{Head:post.title,Para:post.content});
});


app.get("/post/:url1/:url2/:url3/:url4", function (req, res) {

  let curr_user = req.session.user;
  var url = secrets.url + req.params.url1 + "/" + req.params.url2 + "/" + req.params.url3 + "/" + req.params.url4 + ".json";


  // res.render("groups.ejs",{
  //   home: home, about: about, blog: blog , project: project, feedback: feedback , logout: logout , profile:profile});
  func.fetchPosts(req, res, home, about, blog, project, feedback, logout, profile, url, curr_user);
});



app.get("/post/more/:url1/:url2/:url3/:url4", function (req, res) {

  let curr_user = req.session.user;
  var url = secrets.url + req.params.url1 + "/" + req.params.url2 + "/" + req.params.url3 + "/" + req.params.url4 + ".json";
  //  console.log(url);

  var body = '';


  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url, options, function (response) {
    response.on('data', function (data) {
      body += data;
      //console.log("hello");
    });
    response.on('end', function () {
      body = JSON.parse(body);
      if (body && body.post_stream && body.post_stream.posts) {
        for (var i = 0; i < body.post_stream.posts.length; i++) {
          //console.log(body.post_stream.posts[i].post_number);
        }
        res.json(body.post_stream.posts);
      } else {
        res.json([]);
      }


      // console.log(groups);
      // console.log(body.post_stream.posts);


    });
  }).on('error', function () {
    console.log('errorr');
  });
});



app.post("/", function (req, res) {
  let user = req.session.user;
  if (user) {
    //  func.createGroup(req,res,item);
    if (req.body.hasOwnProperty('compose_topic')) {
      //public topics
      func.create_topic(req, res);

    }
    else if (req.body.hasOwnProperty('compose_pvt_msg')) {
      //Create Private message

      func.pvt_msg(req, res);

    }

  } else {
    res.redirect('/');
  }
});

app.post('/chatpost', (req, res) => {
  let user = req.session.user;
  if (user) {
    if (req.body.hasOwnProperty('compose')) {
      func.pvt_msg(req, res);
    }
  } else {
    res.redirect('/');
  }
});


app.get("/group/:topic/:id/:offset", function (req, res) {
  let curr_user = req.session.user;
  var id = req.params.topic;
  var i = req.params.offset;

  var body3 = '';
  var url2 = secrets.url + 'groups/' + id + '/members' + '.json' + "?offset=" + i + "&order=&desc=&filter=";
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      res.json(body3);
    });
    //console.log(body3);

  });

});



app.get("/group/:name/:id/load/:offset", function (req, res) {

  let curr_user = req.session.user;
  var name = req.params.name;
  var id = req.params.id;
  var i = req.params.offset;

  var body3 = '';
  var url2 = secrets.url + 'c/' + name + "/" + id + '.json' + '?page=' + i;
  //console.log(url2);

  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url2, options, function (response) {
    response.on('data', function (data) {
      body3 += data;
    });
    response.on('end', function () {
      body3 = JSON.parse(body3);
      // console.log(body3.topic_list.topics);
      res.json(body3);
    });
    // console.log(body3);

  });


});

app.get('/categories', (req, res) => {
  var url = secrets.url + '/categories.json';
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url, options, (response) => {
    var body = '';
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);
      res.json(body.category_list.categories);
    });
  });
});


app.get("/user/:uname", function (req, res) {
  let curr_user = req.session.user;
  var id = req.params.uname;
  var body = '';
  var url = secrets.url + "users/" + id + ".json";

  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url, options, function (response) {
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);

      var user_det = body.user;
      var obj = { user_det: user_det, curr_user: curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout,url:secrets.url };
      // res.send("hi");
      func.request_summary(res, obj, 'other_profile');
      // console.log("jk");
    });
    // console.log(body3);

  });
});



app.get("/sent/:id", function (req, res) {
  let curr_user = req.session.user;
  var id = req.params.id;
  var body = '';
  var url = secrets.url+"/topics/private-messages-sent/" + id + ".json";

  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url, options, function (response) {
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);
      //console.log(body);
      res.json(body.topic_list.topics);

      // res.render("user.ejs",{user_det:user_det,curr_user:curr_user,home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout});
      // console.log("jk");
    });
    // console.log(body3);

  });
});

app.get("/receive/:id", function (req, res) {
  let curr_user = req.session.user;
  var id = req.params.id;
  var body = '';
  var url = secrets.url+"/topics/private-messages/" + id + ".json";

  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url, options, function (response) {
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);
      // console.log(body.topic_list.topics);

      res.json(body.topic_list.topics);

      // res.render("user.ejs",{user_det:user_det,curr_user:curr_user,home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout});
      // console.log("jk");
    });
    // console.log(body3);

  });
});

app.get('/groups.json', (req, res) => {
  var url = secrets.url + '/groups.json';
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      var body = '';
      response.on('data', (data) => {
        body += data;
      });
      response.on('end', () => {
        body = JSON.parse(body);

        res.json(body.groups);
      });
    }
  });
});

app.post('/group/:topic/:id/', (req, res) => {
  //console.log(req.body);

  res.redirect('/group/' + req.params.topic + '/' + req.params.id);
});

app.get('/u/:uname', (req, res) => {
  res.redirect('/user/' + req.params.uname);
});

app.get('/t/:tname/:tid', (req, res) => {
  res.redirect('/post/t/' + req.params.tname + '/' + req.params.tid + '/1');
});

app.get("/user/subscribed/:uname", function (req, res) {
  var id = req.params.uname;
  var url1 = secrets.url + '/categories.json';
  var url2 = secrets.url + "users/" + id + ".json";
  let curr_user = req.session.user;

  var body1 = '';
  var body2 = '';
  var body3 = [];
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url1, options, (response) => {

    response.on('data', function (data) {
      body1 += data;
    });
    response.on('end', function () {
      body1 = JSON.parse(body1);

      https.get(url2, options, function (response) {
        //console.log(url2);
        response.on('data', function (data) {
          body2 += data;
        });
        response.on('end', function () {
          body2 = JSON.parse(body2);
          body1 = body1.category_list.categories;
          body2 = body2.user.groups;
          //console.log(body1);
          //console.log(body2);
          for (var i = 0; i < body2.length; i++) {
            for (var j = 0; j < body1.length; j++) {
              // console.log(body1[j].name);
              //console.log(body2[i].name.split('_').join(' '));
              if (body2[i].name.split('_')[0].toLowerCase() == body1[j].slug) {
                //console.log("Yes");
                //console.log(body1[j].name);
                body3.push(body1[j]);
              }

            }
          }

          //console.log(body3);
          res.json(body3);

        });

      });



    });
  });
});



app.get("/user/common/:uname", function (req, res) {
  var id = req.params.uname;
  var url1 = secrets.url + '/categories.json';
  var url2 = secrets.url + "users/" + id + ".json";
  let curr_user = req.session.user;

  var body1 = '';
  var body2 = '';
  var body3 = [];
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url1, options, (response) => {

    response.on('data', function (data) {
      body1 += data;
    });
    response.on('end', function () {
      body1 = JSON.parse(body1);

      https.get(url2, options, function (response) {
        //console.log(url2);
        response.on('data', function (data) {
          body2 += data;
        });
        response.on('end', function () {
          body2 = JSON.parse(body2);
          body1 = body1.category_list.categories;
          body2 = body2.user.groups;
          //console.log(body1);
          //console.log(body2);
          for (var i = 0; i < body1.length; i++) {
            var x = false;
            for (var j = 0; j < body2.length; j++) {
              if (body1[i].slug == body2[j].name.split('_')[0].toLowerCase()) {
                x = true;

              }

            }
            if (x == false) {
              body3.push(body1[i]);


            }
          }

          //console.log(body3);
          res.json(body3);

        });

      });



    });
  });
});





app.post('/reply/:slug/:tid', (req, res) => {
  let curr_user = req.session.user;
  if (curr_user) {
    func.reply_pvt(req, res);
  } else {
    res.redirect('/');
  }

});
