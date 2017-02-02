$(document).ready(function() {
  var list = [];
  var next
  var offset = 0;

  function clearModal() {
    $('.type').detach();
    $('.modal-img').detach();
    $('.title-name').detach();
    $('.description-text').detach();
    $('.loader-modal').detach();
  }

  $('#pokemodal').on('show.bs.modal', function (event) {
    $('.modal-body').append('<div class="loader-modal"><img src="images/pikachu.gif"></img></div>');

    var button = $(event.relatedTarget)
    var id = button.data('id')
    var pokemon = list[id-1];
    var modal = $(this)

    $.get('http://pokeapi.co/api/v2/pokemon-species/' + id).then(function(response) {
      var description = response.flavor_text_entries[1].flavor_text.replace('\n', ' ');
      list[response.id-1].description = description;
      clearModal();
      $('.description').append('<h3 class="description-text">' + pokemon.description + '</h3>');
      $('.modal-title').append('<h1 class="title-name">' + pokemon.name + '</h1>');
      pokemon.type.forEach(function(element) {
        $('.type-slot').append('<div class="type ' + element.type.name + ' col-md-2"><span class="type-text">' + element.type.name + '</span></div>');
      });
      $('.img-slot').append('<img class="modal-img" src="http://assets.pokemon.com/assets/cms2/img/pokedex/full/' + pokemon.idurl + '.png">');
    });
  });
  $('#pokemodal').on('hide.bs.modal', function (event) {
    clearModal();
  });

  function loadPokemons(url) {
    $('body').append('<div class="loader-page"><img src="images/pikachu.gif"></img></div>'); //loader
    $('body').append('<div class="row"><div class="col-md-6 col-md-offset-3"><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div></div></div>');
    offset += 20;

    $.get(url).then(function(response) { //get 20 pokemon names and urls
      //get url to the next 20 pokemons
      next = response.next;
      return response.results.map(function(pokemon) { //array of promises with the 20 get requests
        return $.get(pokemon.url).then(function(response) { //each pokemon get request
          //put zeros before id number to get the large image
          var str = "" + response.id;
          var pad = "000";
          var idurl = pad.substring(0, pad.length - str.length) + str;
          //create the pokemon object
          var pokemon = {
            name: response.name,
            idurl: idurl,
            id: response.id,
            sprite: response.sprites.front_default,
            type: response.types
          };
          //pokemon array ordered by id
          list[pokemon.id-1] = pokemon;
          //list length feedback
          var percent = list.length/offset*100;
          $('.progress-bar').css('width', percent+'%').attr('aria-valuenow', list.length).attr('aria-valuemax', offset);
        }).promise();
      });
    }).then(function(promises) {
      return $.when.apply($, promises).then(function() { //wait all 20 requests
        for(var index = offset-20; index <= offset-1; index++){
          pokemon = list[index];
          $('.poke_list').append('<div class="col-md-3"> <div class="card" data-toggle="modal" data-target="#pokemodal" data-id="' + pokemon.id + '"> <div class="row"> <div class="col-md-12"> <img src="' + pokemon.sprite + '" class="card-image"></img> </div> </div> <div class="row"> <div class="col-md-12"> <h3 class="text-center card-text">' + pokemon.id + ' ' + pokemon.name + '</h3> </div> </div> </div> </div>');
        }
        $('.card')
          .mouseenter(function(){
          $(this).css('box-shadow', '0px 5px 16px 1px rgba(0,0,0,0.75)');
        })
        .mouseleave(function(){
          $(this).css('box-shadow', '0px 0px 4px 1px rgba(0,0,0,0.75)');
        });
        $('.load-more').append('<button type="button" class="btn btn-primary btn-lg btn-load-more">Load More</button>');
        $('.btn-load-more').click(function() {
          $('.btn-load-more').detach();
          loadPokemons(next);
        });
      });
    }).catch(function() {
      $('body').append('<h1>ERRO!</h1>');
    }).always(function() {
      $('.loader-page').detach();
      $('.progress').detach();
    });
  }

  loadPokemons('http://pokeapi.co/api/v2/pokemon/');
});
