
$(document).ready(function() {
  let data_menu;
  let info_produits = {'pizza' : new Map(), 'entree' : new Map(), 'boisson' : new Map(), 'menu' : new Map()};
  let panier = {'pizza' : [], 'entree' : [], 'boisson' : [], 'menu' : new Map()};
  let nb_menu = 0;
  let commander = $('#commander');
  let jpanier = $("#panier");
  let confirmer = $('#confirmer');
  
  commander.prop('disabled', true);
  function ajoutPanier(e){
    for(let i=0; i<panier[e].length; i++){
      jpanier.append('<p class="elementPanier">' + panier[e][i][1] + '  <span class="retirerPanier" id="' + e + i + '">X</span>' + '</p>');
      $('#' +  e + i).off().click(function(){
        panier[e].splice(panier[e].indexOf(panier[e][i]), 1);
        actualiserPrix();
        actualiserPanier();
      });
     }
  }
  function ajoutMenuPanier(){
    for(let i in panier["menu"]){
      jpanier.append('<p class="elementPanier" >' + panier["menu"][i]["nom"] + '  <span class="retirerPanier" id="' + i + '">X</span>');
      for(let j in panier["menu"][i]["entree"]){
        jpanier.append(panier["menu"][i]["entree"][j] );
      }
      for(let j in panier["menu"][i]["pizza"]){
        jpanier.append('<br>' + panier["menu"][i]["pizza"][j] );
      }
      for(let j in panier["menu"][i]["boisson"]){
        jpanier.append('<br>' + panier["menu"][i]["boisson"][j] );
      }
      jpanier.append('</p>');
      $('#'+ i).off().click(function(){
        p = new Map();
        for(j in panier["menu"]){
          if(j!==i){
            p[j] = panier['menu'][j];
          }
        }
        panier['menu'] = p;
        actualiserPrix();
        actualiserPanier();
      });
    }
  }
  function actualiserPanier(){
   jpanier.empty();
   ajoutPanier("pizza");
   ajoutPanier("entree");
   ajoutPanier("boisson")
   ajoutMenuPanier();
  }
  function actualiserPrix(){
    let prix = 0;
    for(let i in panier['pizza']){
      prix += parseInt(panier['pizza'][i][0]);
    }
    for(let i in panier['entree']){
      prix += parseInt(panier['pizza'][i][0]);
    }
    for(let i in panier['boisson']){
      prix += parseInt(panier['pizza'][i][0]);
    }
    for(let i in panier['menu']){
      prix += parseInt(info_produits['menu'][panier['menu'][i]['nom']]['prix']);
    }
    if(prix===0){
      commander.prop('disabled', true);
    }else{
      commander.prop('disabled', false);
    }
    $('#prix').text(prix + '€');
  }
  function ajout(e){
    $.get("http://pizzafoxx.com/"+ e,{},
    function(data) {
      let elphoto = '<div class="container-fluid '+e +'"><div class="row">';
      for(let i=0; i<data.length; i++){
        if(e==='boisson' && data[i]['taille']!=1){
          continue;
        }
        info_produits[e][data[i]["nom"].replace(" ", '_')] = data[i];
        elphoto += ' <div id="' + data[i]["nom"].replace(" ", '_') + '"';
        elphoto += ' class="col-lg-3 col-md-4 col-sm-6 photo">';
        elphoto += '<p>' +data[i]["nom"] + '<input type="checkbox" class="choix" value="'+data[i]["nom"]+'"></p>' + '<img height="200" width="200"  src="../images/'+data[i]["photo"] + '"></div>';
      }
      elphoto += '</div></div>';
      $('#popup').append(elphoto);
      $('.'+e).hide();

      elphoto = '<div class="container-fluid '+e +'"><div class="row">';
      for(let i=0; i<data.length; i++){
        elphoto += ' <div id="' + data[i]["nom"].replace(/ /g, '_') + '"';
        elphoto += ' class="col-lg-3 col-md-4 col-sm-6 photo">';
        elphoto += '<p>' +data[i]["nom"] + ' ' +data[i]['prix'] + '€'+'<button id="ajout'+data[i]["nom"].replace(/ /g, '_').replace('.', '_')+'">Ajouter</button></p>'+ '<img height="200" width="200"  src="../images/'+data[i]["photo"] + '"></div>';
       
      }
      elphoto += '</div></div>';
      $('#deroulant_' + e).append(elphoto);
      $('#deroulant_'+e).hide();
      for(let i=0; i<data.length; i++){
        $('#ajout'+data[i]["nom"].replace(/ /g, '_').replace('.', '_')).click(function(){
          panier['pizza'].push([data[i]['prix'], data[i]["nom"]]);
          actualiserPrix();
          actualiserPanier();
        });
      }
    });
  }
  ajout('pizza');
  ajout('entree');
  ajout('boisson');
  function menu(){
    $.get("http://pizzafoxx.com/menu" ,{},
    function(data) {
      let elphoto = "";
      for(let i=0; i<data.length; i++){
        info_produits['menu'][data[i]["nom"]] = data[i];
        elphoto = '<li class="nos" id="' + data[i]['nom'] +'" class="boutonMenu">' +data[i]['nom'] + ' menu ' +data[i]['prix']+ '€ : Pizza x' +data[i]['nb_pizza']
        +' Boisson x' +  data[i]['nb_boisson']+ ' Entrée x' + data[i]['nb_entree'] +'</li>';
        $('#gauche').append(elphoto);
        $('#liste'+data[i]['nom']).hide();
        $('#'+data[i]['nom']).click(function() {
          $('.boutonPopup').prop('disabled', true);
          $('#ajoutPizza').prop('disabled', false);
          $('#popup').show();
          $('.pizza').show();
          $('#ajoutPizza').hide();
          $('#ajoutBoisson').hide();
          $('#ajoutEntree').show();
          confirmer.hide();
          $('.pizza .choix').off().on('change', function() {
            if($('.pizza input[type=checkbox]:checked').length > data[i]['nb_pizza']){
                this.checked = false;
            }
            else if($('.pizza input[type=checkbox]:checked').length == data[i]['nb_pizza']){
              $('#ajoutEntree').prop('disabled', false);
            }else{
              $('#ajoutEntree').prop('disabled', true);
            }
          });
          $('.entree .choix').off().on('change', function() {
            if($('.entree input[type=checkbox]:checked').length > data[i]['nb_entree']) {
                this.checked = false;
            }
            else if($('.entree input[type=checkbox]:checked').length == data[i]['nb_entree']){
              $('#ajoutBoisson').prop('disabled', false);
            }
            else{
              $('#ajoutBoisson').prop('disabled', true);
            }
          });
          $('.boisson .choix').off().on('change', function() {
            if($('.boisson input[type=checkbox]:checked').length > data[i]['nb_boisson']){
                this.checked = false;
            }
            else if($('.boisson input[type=checkbox]:checked').length == data[i]['nb_boisson']){
                 confirmer.prop('disabled', false);
            }  
            else{
              confirmer.prop('disabled', true);
            }
          });
          $('#ajoutPizza').off().click(function(){
            $('#popup .container-fluid').hide();
            $('#ajoutPizza').hide();
            $('#ajoutBoisson').hide();
            $('#ajoutEntree').show();
            $('#popup').show();
            $('.pizza').slideToggle();
            confirmer.hide();
          });
          $('#ajoutEntree').off().click(function(){
            $('#popup .container-fluid').hide();
            $('#ajoutPizza').show();
            confirmer.hide();
            $('#ajoutBoisson').show();
            $('#ajoutEntree').hide();
            $('#popup').show();
            $('.entree').slideToggle();
           
          });
          $('#ajoutBoisson').off().click(function(){
            confirmer.show();
            $('#popup .container-fluid').hide();
            $('#ajoutPizza').hide();
            $('#ajoutBoisson').hide();
            $('#ajoutEntree').show();
            $('#popup').show();
            $('.boisson').slideToggle();
          });
          confirmer.off().click(function(){
            panier['menu']['menu'+nb_menu] = {'prix' : data[i]['prix'], 'nom' : data[i]['nom'], 'pizza' : [], 'boisson' : [], 'entree' : []};
            
            $('.boisson input[type=checkbox]:checked').each(function() {
              panier['menu']['menu'+nb_menu]['boisson'].push($(this).val());
            });
            $('.entree input[type=checkbox]:checked').each(function() {
              panier['menu']['menu'+nb_menu]['entree'].push($(this).val());
            });
            $('.pizza input[type=checkbox]:checked').each(function() {
              panier['menu']['menu'+nb_menu]['pizza'].push($(this).val());
            });
            $('#popup').hide();
            $('#popup .container-fluid').hide();
            $('.choix').prop( "checked", false );
            actualiserPrix();
            actualiserPanier();
            nb_menu++;
          })
         
      });
      }


    });

  }

  function formToJSON(form) {
    let array = $(form).serializeArray(); 
    let json = {};
    $.each(array, function () {
      json[this.name] = this.value || "";
    });
    return json;
  }
  function a(){
    $('#submit').click(function(e){
      e.preventDefault();
      $.post("http://pizzafoxx.com/formulaire-client",  {'form' : formToJSON('#form'), 'panier' : panier},
      function(data) {
        let doc = document.open('text/html', 'replace');
        doc.write(data);
        doc.close();
        a();
      });
  });
}
  $("#commander").click(function(){
    $.get("http://pizzafoxx.com/formulaire" ,{},
    function(data) {
      let doc = document.open('text/html', 'replace');
      doc.write(data);
      doc.close();
      
      $('#submit').click(function(e){
        e.preventDefault();
        $.post("http://pizzafoxx.com/formulaire-client",  {'form' : formToJSON('#form'), 'panier' : panier},
        function(data) { 
          let doc = document.open('text/html', 'replace');
          doc.write(data);
          doc.close();
          a();
        });
    });
    });
  });

  $('.fermerPopup').click(function(){
    $('#popup').hide();
    $('#popup .container-fluid').hide();
    $('.choix').prop( "checked", false );
  });
  menu();
  $('#nosPizzas').click(function(){
    $('#deroulant_pizza').slideToggle();
  });
  $('#nosEntrees').click(function(){
    $('#deroulant_entree').slideToggle();
  });
  $('#nosBoissons').click(function(){
    $('#deroulant_boisson').slideToggle();
  });
  

});

