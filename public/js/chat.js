//jshint esversion:8
let dropdownBtn = document.querySelector('.menu-btn');
let menuContent = document.querySelector('.menu-content');
dropdownBtn.addEventListener('click', () => {
  if (menuContent.style.display === "") {
    menuContent.style.display = "block";
  } else {
    menuContent.style.display = "";
  }
});
//Loading categories on page Load
window.onload = function () {
  document.getElementById("category_click").click();

};
//Modal functioning
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("new_message");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closes")[0];

// When the user clicks the button, open the modal
$(document).ready(function () {
  btn.addEventListener('click', function () {
    // alert("ji");
    if (document.getElementById('home')) {
      modal.style.display = "block";
      $.ajax({
        url: '/categories'
      }).done(
        (data) => {
          $('select[name="category"] option').remove();
          $('select[name="category"]').append('<option value=\"\" disabled selected>Select your Category</option>');
          for (var i = 0; i < data.length; i++) {
            $('select[name="category"]').append('<option value=\"' + data[i].id + '\">' + data[i].name + '</option>');
          }
        }
      );
    } else {
      modal.style.display = "block";

      $.ajax({
        url: '/categories'
      }).done(
        (data) => {
          $('select[name="category"] option').remove();
          $('select[name="category"]').append('<option value=\"\" disabled selected>Select your Category</option>');
          for (var i = 0; i < data.length; i++) {
            $('select[name="category"]').append('<option value=\"' + data[i].id + '\">' + data[i].name + '</option>');
          }
        }
      );
    }
  });


  $('input[name="user_search"]').keyup(() => {
    var text = $('input[name="user_search"]').val();
    $.ajax({
      url: '/find',
      data: { text: text }
    }).done(
      (data) => {
        $('#users1 option').remove();
        for (var i = 0; i < data.length; i++) {
          var txt = data[i].name + ' (@' + data[i].username + ')';
          $('#users1').append('<option value=\"' + data[i].username + '\">' + txt + '</option>');
        }
      }
    );
  });
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function myFunc() {
  //alert("hi");
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');
  //alert(filter);
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].id;
    txtValue = a;
    // alert(txtValue);
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      // alert(li[i].id);
      li[i].style.display = "";
    } else {
      // alert("hi");
      li[i].style.display = "none";
    }
  }
}



    //Loading messages on left pane
    function function_pvt() {
      $('#menu_active').text('Messages');
      var e = document.getElementById("category_click");
      e.classList.remove("active-tab");
      e = document.getElementById("private_click");
      e.classList.add("active-tab");
      e = document.getElementById("group_click");
      e.classList.remove("active-tab");
      document.getElementById("holder2").style.display = "Block";
      var my_div = $("#holder2");


      var username = $('#curr_user').attr('name');
      //alert("hi");

      $.ajax({
        url: "receive/" + username
      })

        .done(function (data) {
          //console.log(data);
          $('#holder2').html("");
          var elements = '';


          for (var i = 0; i < data.length; i++) {
            var mydate, user_id, newdate, newtime, slud, ide;
            var img = "https://bootdey.com/img/Content/avatar/avatar1.png";

            mydate = data[i].last_posted_at;
            slug = data[i].slug;
            ide = data[i].id;


            newdate = mydate[8] + mydate[9] + "/" + mydate[5] + mydate[6];
            //alert('newdate: ' + newdate);

            newtime = mydate[11] + mydate[12] + mydate[13] + mydate[14] + mydate[15];
            // alert('newtime: ' + newtime);

            elements = elements + '<div onClick=' + 'load_posts("' + slug + "/" + ide + "/1" + '")' + '>' + '<li id="' + data[i].fancy_title + '" class="" data-toggle="tab" data-target="#inbox-message-' + i + '">' + '<div class="message-count">' + data[i].posts_count + '</div>' + '<img alt="" class="img-circle medium-image" src="' + img + '">' + '<div class="vcentered info-combo">' + '<h3 class="no-margin-bottom name">' + '<b>' + data[i].fancy_title + '</b>' + ' </h3>' + '<h5>' + "Latest post by:" + data[i].last_poster_username + '</h5>' + '</div>' + '<div class="contacts-add">' + '<span class="message-time">' + newdate + '<br>' + newtime + '<sup>' + '</sup>' + '</span>' + '<i class="fa fa-trash-o">' + '</i>' + '</div>' + '</li>' + '</div>';

          }

          $('#holder2').append(elements);

          $.ajax({
            url: "sent/" + username
          })

            .done(function (data2) {
              //console.log(data2);


              var elements = '';


              for (var i = 0; i < data2.length; i++) {
                var mydate, newdate, newtime, slug, ide;

                mydate = data2[i].last_posted_at;
                slug = data2[i].slug;
                ide = data2[i].id;

                newdate = mydate[8] + mydate[9] + "/" + mydate[5] + mydate[6];
                //alert('newdate: ' + newdate);

                newtime = mydate[11] + mydate[12] + mydate[13] + mydate[14] + mydate[15];
                // alert('newtime: ' + newtime);

                elements = elements + '<div onClick=' + 'load_posts("' + slug + "/" + ide + "/1" + '")' + '>' + '<li id="' + data2[i].fancy_title + '" class="" data-toggle="tab" data-target="#inbox-message-' + 1 + '">' + '<div class="message-count">' + data2[i].posts_count + '</div>' + '<img alt="" class="img-circle medium-image" src="https://bootdey.com/img/Content/avatar/avatar1.png">' + '<div class="vcentered info-combo">' + '<h3 class="no-margin-bottom name">' + '<b>' + data2[i].fancy_title + '</b>' + ' </h3>' + '<h5>' + "Latest post by:" + data2[i].last_poster_username + '</h5>' + '</div>' + '<div class="contacts-add">' + '<span class="message-time">' + newdate + '<br>' + newtime + '<sup>' + '</sup>' + '</span>' + '<i class="fa fa-trash-o">' + '</i>' + '</div>' + '</li>' + '</div>';

              }

              $('#holder2').append(elements);

            });


        });


      setTimeout(function () {
        $(".chat-body").animate({ scrollTop: $('.chat-body').prop("scrollHeight") }, 1000);
      }, 1);
      document.getElementById("holder4").style.display = "None";
      document.getElementById("holder5").style.display = "None";
      document.getElementById("holder6").style.display = "None";
    }
    function function_category() {
      $('#menu_active').text('Groups');
      var e = document.getElementById("category_click");
      e.classList.remove("active-tab");
      e = document.getElementById("private_click");
      e.classList.remove("active-tab");
      e = document.getElementById("group_click");
      e.classList.add("active-tab");
      var username = $('#curr_user').attr('name');
      document.getElementById("holder6").style.display = "None";
      document.getElementById("holder4").style.display = "Block";
      document.getElementById("holder2").style.display = "None";
      document.getElementById("holder5").style.display = "None";
      $.ajax({
        url: "/user/subscribed/" + username
      })

        .done(function (data) {
          //console.log(data);

          var elements = '';
          for (var i = 0; i < data.length; i++) {
            var slug, ide;
            slug = data[i].slug;
            ide = data[i].id;

            elements = elements + '<div onClick=' + 'load_topics("' + slug + "/" + ide + "/load/0" + '")' + '>' + '<li id="' + data[i].name + '" class="" data-toggle="" data-target="">' + '<div class="message-count">' + data[i].topic_count + '</div>' + '<img alt="" class="img-circle medium-image" src="https://bootdey.com/img/Content/avatar/avatar1.png">' + '<div class="vcentered info-combo">' + '<h3 class="no-margin-bottom name">' + '<b>' + data[i].name + '</b>' + ' </h3>' + '<h5>' + "Latest post by:" + '</h5>' + '</div>' + '<div class="contacts-add">' + '<span class="message-time">' + '<br>' + '<sup>' + '</sup>' + '</span>' + '<i class="fa fa-trash-o">' + '</i>' + '<i class="fa fa-share-alt " >' + '</i>' + '</div>' + '</li>' + '</div>';
          }

          $('#holder4').html(elements);
        });


    }
    function function_category_common() {
      $('#menu_active').text('Categories');
      var e = document.getElementById("category_click");
      e.classList.add("active-tab");
      e = document.getElementById("private_click");
      e.classList.remove("active-tab");
      e = document.getElementById("group_click");
      e.classList.remove("active-tab");
      var username = $('#curr_user').attr('name');
      document.getElementById("holder6").style.display = "Block";
      document.getElementById("holder4").style.display = "None";
      document.getElementById("holder2").style.display = "None";
      document.getElementById("holder5").style.display = "None";
      $.ajax({
        url: "/user/common/" + username
      })

        .done(function (data) {


          var elements = '';
          for (var i = 0; i < data.length; i++) {
            var slug, ide, logo;
            logo="https://bootdey.com/img/Content/avatar/avatar1.png";
            slug = data[i].slug;
            ide = data[i].id;
            if (data[i].uploaded_logo) {
              logo = data[i].uploaded_logo.url;
              logo=myUrl+logo;
            }
            if(data[i].description){
            elements = elements + '<div onClick=' + 'load_topics("' + slug + "/" + ide + "/load/0" + '")' + '>' + '<li id="' + data[i].name + '" class="" data-toggle="" data-target="">' + '<div class="message-count">' + data[i].topic_count + '</div>' + '<img alt="" class="img-circle medium-image" src="'+logo+'">' + '<div class="vcentered info-combo">' + '<h3 class="no-margin-bottom name">' + '<b>' + data[i].name + '</b>' + ' </h3>' + '<h5>' +data[i].description.substring(0,60)+'...' + '</h5>' + '</div>' + '<div class="contacts-add">' + '<span class="message-time">' + '<br>' + '<sup>' + '</sup>' + '</span>' + '<i class="fa fa-trash-o">' + '</i>' + '<div onClick=' + 'copy_topic("' + "/group/" + slug + "/" + ide + '")' + '>' + '<i class="fa fa-share-alt">' + '</i>' + '</div>' + '</div>' + '</li>' + '</div>';
          }else{
              elements = elements + '<div onClick=' + 'load_topics("' + slug + "/" + ide + "/load/0" + '")' + '>' + '<li id="' + data[i].name + '" class="" data-toggle="" data-target="">' + '<div class="message-count">' + data[i].topic_count + '</div>' + '<img alt="" class="img-circle medium-image" src="'+logo+'">' + '<div class="vcentered info-combo">' + '<h3 class="no-margin-bottom name">' + '<b>' + data[i].name + '</b>' + ' </h3>' +'</div>' + '<div class="contacts-add">' + '<span class="message-time">' + '<br>' + '<sup>' + '</sup>' + '</span>' + '<i class="fa fa-trash-o">' + '</i>' + '<div onClick=' + 'copy_topic("' + "/group/" + slug + "/" + ide + '")' + '>' + '<i class="fa fa-share-alt">' + '</i>' + '</div>' + '</div>' + '</li>' + '</div>';
            }
          }

          $('#holder6').html(elements);
        });
    }

    //Loading each topic on left pane
    function copy_topic(x) {
      alert("Copy: " + x);
    }

    function load_topics(x) {
      document.getElementById("holder5").style.display = "Block";
      document.getElementById("holder2").style.display = "None";
      document.getElementById("holder6").style.display = "None";
      document.getElementById("holder4").style.display = "None";
      var my_div = $("#holder5");
      var l = 1;



      $.ajax({

        url: "/group/" + x
      })
        .done(function (data) {
          // //console.log(data);

          data = data.topic_list.topics;

          var elements = '';


          for (var i = 0; i < data.length; i++) {
            var mydate, newdate, newtime, slug, ide, logo;
            slug = data[i].slug;
            ide = data[i].id;

            if (data[i].last_posted_at != null) {
              mydate = data[i].last_posted_at;

              newdate = mydate[8] + mydate[9] + "/" + mydate[5] + mydate[6];
              newtime = mydate[11] + mydate[12] + mydate[13] + mydate[14] + mydate[15];

            }
            else {
              newdate = "";
              newtime = "";
            }
            elements = elements + '<div onClick=' + 'load_posts("' + slug + "/" + ide + "/1" + '")' + '>' + '<li id="' + data[i].title + '" class="" data-toggle="tab" data-target="#inbox-message-' + i + '">' + '<div class="message-count">' + data[i].posts_count + '</div>' + '<img alt="" class="img-circle medium-image" src="https://bootdey.com/img/Content/avatar/avatar1.png">' + '<div class="vcentered info-combo">' + '<h3 class="no-margin-bottom name">' + '<b>' + data[i].fancy_title + '</b>' + ' </h3>' + '<h5>' + "Latest post by:" + data[i].last_poster_username + '</h5>' + '</div>' + '<div class="contacts-add">' + '<span class="message-time">' + newdate + '<br>' + newtime + '<sup>' + '</sup>' + '</span>' + '<i class="fa fa-trash-o">' + '</i>' + '<div onClick=' + 'copy_topic("' + "/post/t/" + slug + "/" + ide + "/1" + '")' + '>' + '<i class="fa fa-share-alt ">' + '</i>' + ' </div>' + '</div>' + '</li>' + '</div>';

          }


          $('#holder5').html(elements);
        });

    }

    //Loading posts
    function my_Function(z) {

      if (z.matches) { // If media query matches
        //alert("hi");
        document.getElementById("inbox").style.display = "None";
        document.getElementById("back_").style.display = "Block";
        document.getElementById("inbox-message-1").style.display = "Block";
      }
      else {
        document.getElementById("inbox").style.display = "Block";
        document.getElementById("inbox-message-1").style.display = "Block";
        document.getElementById("back_").style.display = "None";
      }
    }
    function my_Function2(z) {

      if (z.matches) { // If media query matches
        //alert("hi");
        document.getElementById("inbox").style.display = "Block";
        document.getElementById("inbox-message-1").style.display = "None";

      }
    }
    function my_func2() {
      // alert("ki");
      var z = window.matchMedia("(max-width: 767px)");
      my_Function2(z); // Call listener function at run time
      z.addListener(my_Function2); // Attach listener function on state changes


    }

    function load_posts(x) {

      var username = $('#curr_user').attr('name');

      var y = x.split('/');

      var tid = y[1];
      var tslug = y[0];


      $('#slug').attr('name', tslug);
      $('#slug').html('<h4 id="topic_head">' + tslug.split('_').join(' ').split('-').join(' ') + '</h4>');
      $('#tid').attr('name', tid);
      //  alert('clicked');
      $('li').removeClass('active');
      $(this).addClass('active');


      var my_div = $("#holder3");

      //alert("hi");

      $.ajax({
        url: "post/more/t/" + x
      })

        .done(function (data) {

          var elements = '';


          for (var i = 0; i < data.length; i++) {

            if (data[i].username != username) {//for receive
              elements = elements + '<div class="message info">' + '<img alt="" class="img-circle medium-image" src="'+myUrl+'/user_avatar/'+myUrl.substring(8,myUrl.length)+'/' + data[i].username + '/120/671_2.png">' + '<div class="message-body">' + '<div class="message-info">' + '<b>' + "@" + data[i].username + "--" + data[i].name + '</b>' + ' </h3>' + '<h5>' + '</h5>' + '</div>' + '<hr>' + '<div class="message-text">' + data[i].cooked + '</div>' + '</div>' + '<br>' + '</div>';
            }
            else {
              //for sent
              elements = elements + '<div class="message my-message">' + '<img alt="" class="img-circle medium-image" src="'+myUrl+'/user_avatar/'+myUrl.substring(8,myUrl.length)+'/' + data[i].username + '/120/671_2.png">' + '<div class="message-body">' + '<div class="message-body-inner">' + '<div class="message-info">' + '<b>' + "@" + data[i].username + "--" + data[i].name + '</b>' + ' </h3>' + '<h5>' + '</h5>' + '</div>' + '<hr>' + '<div class="message-text">' + data[i].cooked + '</div>' + '</div>' + '</div>' + '<br>' + '</div>';

            }
          }

          $('#holder3').html(elements);
          document.getElementById('chat_').scrollTop = 9999999;
        });


      var z = window.matchMedia("(max-width: 767px)");
      my_Function(z); // Call listener function at run time
      z.addListener(my_Function); // Attach listener function on state changes
      //alert(x);

    }

    //Navbar
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    function openNav() {
      document.getElementById("mySidebar").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
    }

    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    function closeNav() {
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
    }
