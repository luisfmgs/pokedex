$(document).ready(function() {
  var list = [];

  function loadPokemons() {
    $('body').append('<div class="loader"><img src="images/pikachu.gif"></img></div>');
    $.get('http://pokeapi.co/api/v2/pokemon/').then(function(response1) {
      return response1.results.map(function(pokemon) {
        return $.get(pokemon.url).then(function(response2) {
          var str = "" + response2.id;
          var pad = "000";
          var idurl = pad.substring(0, pad.length - str.length) + str;
          var pokemon = {
            name: response2.name,
            idurl: idurl,
            id: response2.id,
            sprite: response2.sprites.front_default,
            type: response2.types
          };
          list[pokemon.id-1] = pokemon;
          console.log(list.length);
          return pokemon.id
        }).then(function(response) {
          return $.get('http://pokeapi.co/api/v2/pokemon-species/' + response).then(function(response) {
            var description = response.flavor_text_entries[1].flavor_text.replace('\n', ' ');
            list[response.id-1].description = description;
          });
        }).promise();
      });
    }).then(function(promises) {
      return $.when.apply($, promises).then(function() {
        list.forEach( function(pokemon) {
          $('.poke_list').append('<div class="col-md-3"> <div class="card" data-toggle="modal" data-target="#pokemodal" data-id="' + pokemon.id + '"> <div class="row"> <div class="col-md-12"> <img src="' + pokemon.sprite + '" class="card-image"></img> </div> </div> <div class="row"> <div class="col-md-12"> <h2 class="text-center">' + pokemon.id + ' ' + pokemon.name + '</h2> </div> </div> </div> </div>');
        });
        $('#pokemodal').on('show.bs.modal', function (event) {
          var button = $(event.relatedTarget)
          var recipient = button.data('id')
          var pokemon = list[recipient-1];
          var modal = $(this)

          modal.find('.description').text(pokemon.description);
          modal.find('.modal-title').text(pokemon.name);
          pokemon.type.forEach(function(element) {
            $('.type-slot').append('<div class="type ' + element.type.name + ' col-md-2"><span class="type-text">' + element.type.name + '</span></div>');
          });
          $('.img-slot').append('<img class="modal-img" src="http://assets.pokemon.com/assets/cms2/img/pokedex/full/' + pokemon.idurl + '.png">');
        });
        $('#pokemodal').on('hide.bs.modal', function (event) {
          $('.type').detach();
          $('.modal-img').detach();
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
