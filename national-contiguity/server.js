let express = require('express'),
    path = require('path'),
    app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, (err)=>{
    if(err){
        throw err;
    }
    console.log("Server is listening at port 3000");
})