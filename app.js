var express = require('express');
var path = require('path');
var http = require('http');
var static = require('serve-static');
var bodyParser=require('body-parser');
var cookieParser= require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var user = require('./routes/user');

var config = require('./config');

var database_loader = require('./database/database_loader');
var route_loader = require('./routes/route_loader');

var crypto = require('crypto');



function createUserSchema(database){
    database.UserSchema = require('./database/user_schema').createSchema(mongoose);
    
    database.UserModel = mongoose.model('users3', database.UserSchema);
    console.log('UserModel 정의함.');
    
}

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

console.log('config.server_port -> ' + config.server_port);

app.set('port', config.server_port || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true,
    
}));


route_loader.init(app,express.Router());


var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹서버를 실행함 : '+ app.get('port'));
    database_loader.init(app,config);
});
