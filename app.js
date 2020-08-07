const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const path = require('path');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const{allowInsecurePrototypeAccess}=require('@handlebars/allow-prototype-access')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session)
 const env = require('dotenv');
const app = express();
 const{ensureAuthenticated}=require('./helpers/auth');
env.config({path: './config/.env'});
mongoose.promise =global.promise
mongoose.connect('mongodb://localhost/project4', {
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,
})
.then(()=>console.log('mongodb connected successfully!'))
.catch(err=>console.log(err));

const {formatDate} = require('./helpers/hps');



app.engine('handlebars', exphbs({
    helpers:{
        formatDate,
      
        selected: function (selected, options) {
            return options
              .fn(this)
              .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
              )
              .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
              )
          },
        

    },
    handlebars:allowInsecurePrototypeAccess(handlebars),
}))
app.set('view engine', 'handlebars')
   // defaultLayout:'main',
   /* helpers:{
           truncate:truncate,
           select:select,
           stripTags:stripTags,
           formatDate:formatDate,
    }*/

/*handlebars.registerHelper('reduce', function(passedString, startstring, endstring){
    if(passedString){
        if(!startstring) startstring=0;
        if(!endstring) endstring=30;
        var theString = passedString.substring(startstring, endstring);
        return new handlebars.SafeString(theString+'...');
        
    }

})*/

require('./models/Feature');
require('./models/User');
require('./config/passport')(passport);

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))


app.use(passport.initialize())

app.use(passport.session())


app.use(methodOverride('_method'));





app.use(flash())

app.use(function(req, res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.login=req.flash('login');

    //content that will be allowed to show when user login or out//
    res.locals.user=req.user || null;
    next();
});



 




app.use('/', require('./routes/feature'));
app.use('/', require('./routes/user'));

app.use('/', require('./routes/admin'));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname+ '/node_modules/bootstrap/dist/css'))
app.use('/js', express.static(__dirname+ '/node_modules/bootstrap/dist/js'))
app.use('/dist', express.static(__dirname+ '/node_modules/jquery/dist'))
app.use('/dist', express.static(__dirname+ '/node_modules/popper.js/dist'))


app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts',express.static(__dirname + '/node_modules/font-awesome/fonts'));







app.set( 'port', ( process.env.PORT || 300 ));

// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
  });