/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const cors = require('cors');

const { check, validationResult, } = require('express-validator'); // validation middleware

const pageDao = require('./dao'); // module for accessing the pages table in the DB
const userDao = require('./dao-users');

/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());
//These 2 top set up 2 middlewares for the entire application. From now on, every route will accept
//json request and will transform the json request in js object
//from now on, a logger would be available meaning that a route defined before these lines, wouldn't work 

const session = require('express-session');


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

/** Creating the session */


app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};





/**************************** Users APIs ******************************/


// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});



/***************************** pages APIs ******************************/


// 1. Retrieve the list of all the available pages.
// GET /api/pages
// This route returns the pageLibrary. It handles also "filter=?" query parameter
app.get('/api/pages',
  (req, res) => {
    // get pages that match optional filter in the query
    pageDao.listPages(req.query.filter)
      // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
      .then(pages => res.json(pages))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

app.get('/api/pages/filter/:userId',
  [ check('userId').isInt({min: 1}) ],
  async (req, res) => {
    try {
      const result = await pageDao.getPageFilterUser(req.params.userId);
      if (result.error)
        res.status(404).json(result);
      else
        // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// 2. Retrieve a page, given its “id”.
// GET /api/pages/<id>
// Given a page id, this route returns the associated page from the library.
app.get('/api/pages/:id',
  [ check('id').isInt({min: 1}) ],    // check: is the id a positive integer?
  async (req, res) => {
    try {
      const result = await pageDao.getPage(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);


// 3. Create a new page, by providing all relevant information.
// POST /api/pages
// This route adds a new page to page library.
app.post('/api/pages',
  [
    check('user').isInt(),
    check('title').isLength({min: 1, max:160}),
    check('author').isLength({min: 1, max:160}),
    // only date (first ten chars) and valid ISO
    // check('creation_date').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    // check('publication_date').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    // WARN: note that we expect watchDate with capital D but the databases does not care and uses lowercase letters, so it returns "watchdate"
    const page = {
      user: req.body.user,
      title: req.body.title,
      author: req.body.author,
      creation_date: req.body.creation_date, // A different method is required if also time is present. For instance: (req.body.watchDate || '').split('T')[0]
      publication_date: req.body.publication_date,
      blocks: req.body.blocks, // alternatively you can use the user id in the request, but it is not safe
      header: req.body.header,
      // header2: req.body.header2,
      paragraph: req.body.paragraph,
      image: req.body.image,
    };

    try {
      const result = await pageDao.createPage(page); // NOTE: createpage returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new page: ${err}` }); 
    }
  }
);

// 4. Update an existing page, by providing all the relevant information
// PUT /api/pages/<id>
// This route allows to modify a page, specifiying its id and the necessary data.
app.put('/api/pages/:id',
  [
    check('id').isInt(),
    // check('user').isInt(),
    check('title').isLength({min: 1, max:160}),
    check('author').isLength({min: 1, max:160}),
    // only date (first ten chars) and valid ISO
    check('creation_date').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('publication_date').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('header').isLength({min: 1, max:500}),
    check('paragraph').isLength({min: 1, max:500}),
    // check('image').isLength({min: 1, max:500}),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
    }
    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.id)) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    const page = {
      id: req.body.id,
      user: req.body.user,
      title: req.body.title,
      author: req.body.author,
      creation_date: req.body.creation_date, // A different method is required if also time is present. For instance: (req.body.watchDate || '').split('T')[0]
      publication_date: req.body.publication_date,
      blocks: req.body.blocks,
      header: req.body.header,
      // header2: req.body.header2,
      paragraph: req.body.paragraph,
      image:req.body.image,
    };

    try {
      const result = await pageDao.updatePage(page.id, page);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of page ${req.params.id}: ${err}` });
    }
  }
);


// 7. Delete an existing page, given its “id”
// DELETE /api/pages/<id>
// Given a page id, this route deletes the associated page from the library.
app.delete('/api/pages/:id',
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      // NOTE: if there is no page with the specified id, the delete operation is considered successful.
      await pageDao.deletePage(req.params.id);
      res.status(200).json({}); 
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of page ${req.params.id}: ${err} ` });
    }
  }
);


// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
