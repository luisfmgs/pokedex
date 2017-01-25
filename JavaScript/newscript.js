$(document).ready(function() {
  var list = [];

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
    $.when(promises).then(function() {
      debugger;
      list.forEach( function(pokemon) {
        $('.poke_list').append('<div class="col-md-3"><div class="card"><div class="row"><div class="col-md-12"><img src="' + sprite + '" class="card-image"></img></div></div><div class="row"><div class="col-md-12"><h2 class="text-center">#' + id + ' ' + name + '</h2></div></div></div></div>');
      });
    });
  });
});
