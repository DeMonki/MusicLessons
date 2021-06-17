const express = require('express');

const cors = require('cors');

//routes..
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`app is running on ${PORT} ` );
});
