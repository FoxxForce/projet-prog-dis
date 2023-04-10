const fs = require('fs');
const http = require('http');
const express = require("express");
const server = express();
const pg = require('pg');

server.use(express.urlencoded({extended : true}));
server.use(express.json());
server.use(express.static('public'));
server.set('view engine', 'ejs');

const pool = new pg.Pool({
  user: 'useradmin',
  host: 'service-psql.default.svc.cluster.local',
  database: 'projet',
  password: 'mypass',
  port: 5432
});



pool.query('SELECT * FROM pizza', (error, results) => {
  if (error) {
    throw error;
  }
  console.log(results.rows);
});

eval(fs.readFileSync('functions.js')+'');

server.get('/', function (req, res) {
  console.log("ds");
  res.sendFile("accueil.html", {root: 'public'});
});

const port = process.env.PORT || 4000;
const hostname = '0.0.0.0';

const serverInstance = server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

pool.connect((err, client, done) => {
  if (err) throw err;
  console.log('Connected to PostgreSQL database');
  client.query('SELECT NOW()', (err, res) => {
    done();
    if (err) {
      console.log(err.stack);
    } else {
      console.log(`PostgreSQL connected at ${res.rows[0].now}`);
    }
  });
});

serverInstance.on('close', () => {
  console.log('Closing PostgreSQL database connection');
  pool.end(() => {
    console.log('PostgreSQL pool has ended');
  });
});

server.get("/pizza", (req, res) => {
    let a = selectAll('pizza', pool).then(resultat=>{res.json(resultat.rows)})
    .catch(err => console.err-(err.stack));
});

server.get("/entree", (req, res) => {
  let a = selectAll('entree', pool).then(resultat=>{res.json(resultat.rows)})
  .catch(err => console.err-(err.stack));
});

server.get("/boisson", (req, res) => {
  let a = selectAll('boisson', pool).then(resultat=>{res.json(resultat.rows)})
  .catch(err => console.err-(err.stack));
});

server.get("/menu", (req, res) => {
  let a = selectAll('menu', pool).then(resultat=>{res.json(resultat.rows)})
  .catch(err => console.err-(err.stack));
});

server.get("/images/:photo", (req, res) =>{
  res.sendFile(req.params.photo, {root: 'public/images'});
});

server.get('/formulaire', function (req, res) {
  data = getData("");
  res.render('formulaire.ejs', data);
});

server.post("/formulaire-client", (req, res) =>{

  let regexAdress = /^[0-9]+ {1}.+$/;
  let regexPostal = /^[0-9]{5}$/;
  let regexPhone = /^[0-9]{10}$/;
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if(req.body.form.lastname === '' || req.body.form.firstname === '' ||
    regexAdress.test(req.body.form.adress) == false ||
    regexPostal.test(req.body.form.postal) == false || req.body.form.city === '' ||
    regexPhone.test(req.body.form.phone) == false || regexEmail.test(req.body.form.email) == false ||
    req.body.form.time<'11:00' || req.body.form.time>'23:00'){
      data = getData("erreur dans le formulaire, tous les champs doivent être remplis et l'horaire doit être compris entre 11:00 et 23:00 ");
      res.render('formulaire.ejs', data);
  }else{
    let panier = JSON.stringify(req.body.panier);
    addOrder(req, pool).then(resultat=>{console.log('commande' + resultat.rows[0]['max']);
    fs.writeFileSync('commande' + resultat.rows[0]['max'], panier);})
    .catch(err => console.err-(err.stack));
    res.redirect("/");
  }
});

server.post("/deja-livre", (req, res) =>{
  let commande = deja_livre_ou_non(req, pool);
  res.redirect("/livraison");
});

server.get("/livraison", (req, res) =>{
  getOlderCommand(pool).then(resultat=>{
    if(resultat === undefined){
      let error = {
        nature: "Nous ne trouvons plus de livraison pour le moment, veuillez attendre avant de réessayer.",
      }
      res.render('error.ejs', error);
    }
    try{
      let dataraw = fs.readFileSync('commande' + resultat.id);
      let data = JSON.parse(dataraw);
      alldata = {
        commande: data,
        client: resultat,
      };
      res.render('livraison.ejs', alldata);
    } catch (err) {
      console.log(resultat.id);
      console.log(commande);
      let error = {
        nature: "Commande introuvable, veuillez contacter le SAV",
      }
      res.render('error.ejs', error);
    }})
  .catch(err => console.err-(err.stack));
});
