import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Image,
  Text,
  View,
  ActivityIndicator,
  Button
} from 'react-native';


/**
 * Pokemon screen gets a pokemonId route parameter from previos screen.
 * it can be used to fetch pokemondata from net.
 */

export function PokemonScreen({ route, navigation }) {
  const [pokemon, setPokemon] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const { pokemonName, pokemonUrl } = route.params;

  let pname = pokemonName.toLowerCase();
  let pokemonIndex = pokemonUrl.split('/')[6]
  console.log(pokemonIndex)

  /**
   * This is asynchronous function inside PokemonScreen. 
   * Fetching the pokemon takes time and we do not block the 
   * screen but show loading indicator instead. Fetch itself
   * uses callback function (setPokemon) to inform that data is ready.
   */

  useEffect(() => {
    console.log("get pkmn");
    const url = pokemonUrl;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setPokemon(data))
      .catch((error) => setErr(error))
      .finally(() => setLoading(false));
  }, []);
  //Empty brackets mean that pokemons are only fetched when screen is loaded.

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
  //Add pokemon name to error text to see that navigation parameter is read correctly
  if (err) {
    return (
      <View>
        <Text>Could not retrieve {pname}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}>
      <View style={{ height: '50%', backgroundColor: '#FBEEBF' }}>
        <Text style={{ fontSize: 20 }}>Pokemon screen for {pokemonName}</Text>
        <Text style={{ fontSize: 20 }}>Pokemon weight {pokemon.weight}</Text>
        <Text style={{ fontSize: 20 }}>Pokemon height {pokemon.height}</Text>
        <Text style={{ fontSize: 20 }}>Pokemon moves {pokemon.moves.length}</Text>
        <Button
         title="Show moves"
          onPress={() =>
            navigation.navigate('PokemonMoves', {
              pokemonName: pokemon.name, 
              moves: pokemon.moves
            })
          }>
        </Button>
      </View>
      <View style={{ height: '50%', flex: 1, justifyContent: 'flex-end' }}>
        <Image style={{ height: '100%' }} source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }} />
      </View>
    </View>
  );
}
