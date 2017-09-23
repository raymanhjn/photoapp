var express = require('express');
var path = require('path');
var app = express();


app.use(express.static(__dirname,'www'));
app.set('port', process.env.PORT || 3000);

app.get('*', function(req, res){
    res.sendFile(path.resolve(__dirname, 'www','index.html'));
});

app.listen(app.get('port'), function() {
 console.log("listening to Port", app.get("port"));
});
