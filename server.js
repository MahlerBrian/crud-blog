const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const blogPostRouter = require('./blogPostRouter');


// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/blog-posts', blogPostRouter);
app.use('/blog-posts/:id', blogPostRouter);


let server; 

// start server and return Promise
function runserver() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runserver().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

 


