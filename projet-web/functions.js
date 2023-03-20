async function selectAll(s, pool){
  const client = await pool.connect();
  let res = await client.query('SELECT * FROM ' + s);
  client.release();
  return res;
}

function getData(error){
  var now = new Date();
  var hourPlusOne = now.getHours() + 1;
  if(hourPlusOne === 24){
    hourPlusOne = 0;
  }
  let data = {
    time: ("0"+hourPlusOne).slice(-2)+':'+("0"+now.getMinutes()).slice(-2),
    error: error,
  };
  return data;
}

async function addOrder(data, pool){
  const client = await pool.connect();
  let requestSQL = "insert into commande ( nom, prenom, adresse, code_postale, ville, supp, tel, email , heure) values(\'"+data.body.form.lastname+"\', \'"+data.body.form.firstname+
  "\', \'"+data.body.form.adress+"\', "+data.body.form.postal+", \'"+data.body.form.city+"\', \'"+data.body.form.supp+
  "\', \'"+data.body.form.phone+"\', \'"+data.body.form.email+"\', \'"+data.body.form.time+"\');";
  await client.query(requestSQL);
  let res = await client.query('SELECT MAX(id) FROM commande');
  client.release();
  return res;
}

async function getOlderCommand(pool){
  const client = await pool.connect();
  let res = await client.query("SELECT * FROM commande WHERE heure <= ALL(SELECT heure FROM commande)");
  client.release();
  return res.rows[0];
}

async function deleteCommand(id, pool){
  const client = await pool.connect();
  let res = await client.query("DELETE FROM commande WHERE id = " + id);
  client.release();
}

function deja_livre_ou_non(req, pool){
  let commande = 0;
  if(req.body.already !== undefined){
    let already = req.body.already;
    let splitted = already.split(' ');
    commande = parseInt(splitted[1], 10);
    fs.unlink("commande"+commande, (err) => {
      if (err) throw err;
      console.log("commande" + commande + " deleted!");
    });
    deleteCommand(commande, pool);
  }
  return commande;
}
