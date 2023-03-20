const fs = require('fs');

const http = require('http');
const hostname = '127.0.0.1';
const port = 8080;
const express = require("express");
const server = express();

server.use(express.urlencoded({extended : true}));
server.use(express.json());
server.use(express.static('public'));
server.set('view engine', 'ejs');

const pg = require('pg');
const pool = new pg.Pool({
user: 'useradmin',
host: 'localhost',
database: 'projet2',
password: 'mypass', // accès à une information externe
port: 5432
});

eval(fs.readFileSync('functions.js')+''); //séparation du serveur et des fonctions qu'il emploit

server.get('/', function (req, res) {
  res.sendFile("accueil.html", {root: 'public'});
});

server.listen(port, () => {
  console.log('Server running at http://localhost:'+port);
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
