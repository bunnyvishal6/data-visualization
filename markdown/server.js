let express = require('express'),
    path = require('path');
let app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.port || 3000);