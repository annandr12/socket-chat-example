$(function () {
  var socket = io();
  var typing = false;
  var timeout = undefined;
  var name;


  $(".chat").hide();
  $("#name").focus();
  $("form").submit(function(event){
      event.preventDefault();
  });

  $("#join").click(function(){
    name = $("#name").val();
    if (name != "") {
      socket.emit("join", name);
      $(".login").detach();
      $(".chat").show();
      $("#m").focus();
      ready = true;
    }
  });

  $('.chat').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#messages').append($('<li>').text(name + ": " + $('#m').val()));
    $('#m').val('');
    return false;
  });

  function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
  }

  $('#m').keyup(function() {
    typing = true;
    socket.emit('typing', true);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000);
  });

  socket.on('chat message', function(name,msg){
    $('#messages').append($('<li>').text(name + ": " + msg));

  });
  
  socket.on('update', function(msg){
    $('#messages').append($('<div class="notification">').text(msg));
  });

  socket.on('typing', function(name, data) {
    if (data) {
      $('.typing').html(name + " is typing...");
    } else {
      $('.typing').html("");
    }
  });

  socket.on("update-users", function(users){
    if(ready) {
      $("#users").empty();
      $.each(users, function(clientid, name) {
        $('#users').append($('<li>').text(name));
      });
    }
  });


});