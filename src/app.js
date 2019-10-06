const webby = require('./webby.js');
const path = require('path');
const app = new webby.App();

app.use(webby.static(path.join(__dirname, '..', 'public')));

app.get('/', function(req,res) {
    let submit = 
    `<html>
    <link rel = "stylesheet" type = "text/css" href = "css/styles.css"/>
    <body> 
    <h1> Ready for some Doggy Distress? </h1>
    </br></br>
    <a href="/gallery"> YES! </a>
    </body> 
    </html>`;
    res.send(submit);
}); 

app.get('/gallery', function(req,res) {
    const random = Math.floor(Math.random()*4) + 1; 

    for (let i=1; i<= random; i++) {
        images += `<img src="/img/animal${i}.jpg" height="200" width="200">`;
    }

    let submit = 
    `<html> 
    <link rel = "stylesheet" type = "text/css" href = "css/styles.css"/>
    <body> 
    <h1> Here Are Some Dogs! </hl>
    ${images}
    </body> 
    </html> 
    </br>
    `;
    releaseEvents.send(submit); 
}); 

app.get('/pics', function(req, res) {
    res.set('Location', '/gallery');
    res.status(308).send('');
});

app.get('/img/animal1.jpg');
app.get('/img/animal2.jpg');
app.get('/img/animal3.jpg');
app.get('/img/animal4.jpg');
app.get('/css/style.css');

app.listen(3000, '127.0.0.1');
