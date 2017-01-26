$(document).ready(function() {
  var list = [];

  function loadPokemons() {
    $('body').append('<div class="loader"><img src="images/pikachu.gif"></img></div>');
    $.get('http://pokeapi.co/api/v2/pokemon/')
    .then(function(response1) {
      return response1.results.map(function(pokemon) {
        return $.get(pokemon.url).then(function(response2) {
          var pokemon = {
            name: response2.name,
            id: response2.id,
            sprite: response2.sprites.front_default
          };
          list[pokemon.id-1] = pokemon;
          console.log(list.length);
        }).promise();
      });
    }).then(function(promises) {
      return $.when.apply($, promises).then(function() {
        list.forEach( function(pokemon) {
          $('.poke_list').append('<div class="col-md-3"> <div class="card" data-toggle="modal" data-target="#pokeModal"> <div class="row"> <div class="col-md-12"> <img src="' + pokemon.sprite + '" class="card-image"></img> </div> </div> <div class="row"> <div class="col-md-12"> <h2 class="text-center">#' + pokemon.id + ' ' + pokemon.name + '</h2> </div> </div> </div> </div>');
        });
      });
    }).catch(function() {
      $('body').append('<h1>ERRO!</h1>');
    }).always(function() {
      $('.loader').detach();
    });
  }

  loadPokemons();
});
