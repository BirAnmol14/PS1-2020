//jshint esversion:8
const https = require('https');
const secrets = require('./secrets.js');
const querystring = require('querystring');
module.exports = {
  resetCurrUser: resetCurrUser,
  getUser: getUser,
  verifyUser: verifyUser,
  addNewUser: addNewUser,
  fetchGroups: fetchGroups,
  fetch_Group: fetch_Group,
  fetchPosts:fetchPosts,
  createGroup: createGroup,
  search:search
};

function resetCurrUser() {
  return new getUser('', '', '', '', '');
}


function getUser(email, password, name, userName, identity) {
  this.email = email;
  this.password = password;
  this.name = name;
  this.userName = userName;
  this.identity = identity;
}

function addNewUser(req, res, name, email, password, userName, identity) {
  const url = secrets.url + 'users';
  const user = new getUser(email, password, name, userName, identity);
  const options = {
    method: 'POST',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  var data = {
    "name": name,
    "email": email,
    "password": password,
    "username": userName,
    "active": true,
    "approved": true,
    "user_fields[1]": identity
  };
  data = querystring.stringify(data);
  var request = https.request(url, options, function (response) {
    //console.log(response.statusCode);
    if (response.statusCode === 200) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        var result = JSON.parse(body);
        //console.log(result);
        if (result.success === true && result.active === true) {
          //console.log('yes');
          res.render('register.ejs', { status: 'Successfuly Registered, Kindly Login' });
        } else {
          //console.log('no');
          res.render('register.ejs', { status: result.message });
        }
      });
      response.on('error', function () {
        console.log('error');
        res.redirect('/register', { status: 'Error while registering, try again' });
      });
    } else {
      //console.log('no');
      res.redirect('/register', { status: 'Error while registering, try again' });
    }
  });
  request.write(data);
  request.end();
}

function verifyUser(req, res, userName, password) {
  const url = secrets.url + 'session/';

  var data = {
    'login': userName,
    'password': password,
    'second_factor_method': 1
  };

  data = querystring.stringify(data);

  const options = {
    method: 'POST',
    headers: { 'Api-Key': secrets.key, 'Api-Username': 'system' }
  };

  var json_data = null;
  var request = https.request(url, options, function (response) {
    //console.log(response.statusCode);
    if (response.statusCode === 200) {
      var body = '';
      var result = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        result = JSON.parse(body);

        //console.log(result);
        json_data = result;
        if (result.error === 'Incorrect username, email or password') {
          res.render('register.ejs', { status: result.error });
        } else {
          fetchUserInfo(req, res, userName, password);
        }
      });
    } else {
      //console.log('no');
      res.render('register.ejs', {
        status: 'Not Registered yet, please register before login'
      });
    }
  });
  request.write(data);
  request.end();
}
function fetchUserInfo(req, res, userName, password) {
  var body = '';
  var url = secrets.url + 'users/' + userName + '.json';
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };

  https.get(url, options, function (response) {
    //console.log(response.statusCode);
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);
      req.session.user = body.user;//storing user info
      req.session.badges = body.badges;//storing badges of user
      res.redirect('/home');
    }).on('error', function () {
      console.log('error');
    });
  });

}


function fetchGroups(req, res, home, about, blog, project, feedback, logout, profile,curr_user) {
  var body = '';
  var url = secrets.url + 'groups' + '.json';
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
      var groups = [];
      groups = body.groups;
     // console.log(groups);

      res.render("groups.ejs", {
        curr_user:curr_user,home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, groups: groups
      });

    });


  }).on('error', function () {
    console.log('errorr');
  });



}




function fetch_Group(req, res, home, about, blog, project, feedback, logout, profile, id,curr_user) {
  var body = '';
  var body2 = '';
  var body3 = '';
  var url1 = secrets.url + 'groups/' + id + '.json';
  var url2 = secrets.url + 'groups/' + id + '/members' + '.json';
  var url3 = secrets.url + 'groups/' + id + '/posts' + '.json';
  // console.log(url);
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url1, options, function (response) {
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);
     // console.log("1");
      https.get(url2, options, function (response) {
        response.on('data', function (data) {
          body2 += data;

        });
        response.on('end', function () {
          body2 = JSON.parse(body2);

          var members = [];
          members = body2.members;
          //console.log("2");
          https.get(url3, options, function (response) {
            response.on('data', function (data) {
              body3 += data;

            });
            response.on('end', function () {
              body3 = JSON.parse(body3);
              //console.log("3");
              //console.log(body3);
              //console.log("hello");
              //console.log(members);
              res.render("group.ejs", {
               curr_user:curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, body: body, members: members,posts:body3
              });

            });

          });

        });

      });

    });

  });
}

//addded
function fetchPosts(req, res, home, about, blog, project, feedback, logout, profile,urid,curr_user) {
  var body = '';
  var url =  urid;

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
    //  console.log(body.post_stream.posts);

     // console.log(groups);
     console.log(body);
     res.render("post.ejs", {
      curr_user: curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, body: body
    });
    });
  }).on('error', function () {
    console.log('errorr');
  });
}


function createGroup(req, res, item){
  var url=secrets.url+"admin/groups";
  var options = {
    method: 'POST',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  var data = {
    "group[name]": item};
  data = querystring.stringify(data);
  var request = https.request(url, options, function (response) {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        var result = JSON.parse(body);
        console.log(result);
        if (result.basic_group.id !=null) {
          {console.log('yes');
          }
        } else {
          console.log('no');
        }
      });
      response.on('error', function () {
        console.log('error');
      });
    }
    else   console.log('no');
  });
  request.write(data);
  request.end();
}
function search(text,res){
  var url=secrets.url+"/search/query?term="+text+"&include_blurbs=true";
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
    var body='';
    console.log(response.statusCode);
    response.on('data', function (data) {
      body += data;
      //console.log("hello");
    });
    response.on('end', function () {
      body = JSON.parse(body);
      console.log(body);
      res.send(body);
    });
  }).on('error', function () {
    console.log('errorr');
  });
}

// function get_more(req, res, home, about, blog, project, feedback, logout, profile,id,curr_user,offset){
//   var body3='';
//   var url2 = secrets.url + 'groups/' + id + '/members' + '.json'+"?offset="+offset+"&order=&desc=&filter=";
//   var options = {
//     method: 'GET',
//     headers: {
//       'Api-Key': secrets.key,
//       'Api-Username': 'system'
//     }
//   };
//   https.get(url2, options, function (response) {
//     response.on('data', function (data) {
//       body3 += data;

//     });
//     response.on('end', function () {
//       body3 = JSON.parse(body3);

//       console.log(body3);
//       // res.render("group.ejs", {
//       //   curr_user:curr_user, home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, body: body, members: members,posts:body3
//       //  });



//       });

//     });


// }
