<?php $id = $_SERVER['REQUEST_URI']; $id = str_replace('/', '', $id); ?><!DOCTYPE html>
<html>
  <head>
    <title>Lights</title>
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta names="apple-mobile-web-app-status-bar-style" content="white-translucent" />
    <style type="text/css">
      * {
        margin: 0;
      }
      html, body {
        height: 100%;
      }
      #container {
        min-height: 100%;
        height: auto !important;
        height: 100%;
        margin: 0 auto; /* the bottom margin is the negative value of the footer's height */
        transition: all 0.2s ease-in-out;
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        -ms-transition: all 0.2s ease-in-out;
      }
    </style>
    <script src="http://node.crowdlighting.com:8080/primus/primus.js"></script>
  </head>
  <body>
    <div id="container"><br><br><br></div>
    <script type="text/javascript">
    window.onload = function () {
      // Connect to primus
      var primus = Primus.connect('http://node.crowdlighting.com:8080/');

      // React to a received message
      primus.on('data', function message(data) {
        console.log('New message received: ', data)
        if('colour' in data) {
          document.getElementById("container").style.backgroundColor = data.colour['<?=$id?>'];
        }
      });
    };
    </script>
  </body>
</html>