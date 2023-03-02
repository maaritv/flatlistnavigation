import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getPokemonsFromApiAsync } from './services/pokemonservice';

const Stack = createNativeStackNavigator();

/**
 * Pokemon screen gets a pokemonId route parameter from previos screen.
 * it can be used to fetch pokemondata from net.
 */

function PokemonScreen({ route, navigation }) {
  const [pokemon, setPokemon] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const { pokemonName } = route.params;
  let pname = pokemonName.toLowerCase();

  /**
   * This is asynchronous function inside PokemonScreen. 
   * Fetching the pokemon takes time and we do not block the 
   * screen but show loading indicator instead. Fetch itself
   * uses callback function (setPokemon) to inform that data is ready.
   */

  useEffect(() => {
    console.log("get pkmn");
    const url = `https://pokeapi.co/api/v2/pokemon/${pname}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setPokemon(data))
      .catch((error) => setErr(error))
      .finally(() => setLoading(false));
  },[]); 
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
      <View style={{ height: '70%', backgroundColor: '#FF00FF' }}>
        <Text style={{ fontSize: 20 }}>Pokemon screen for {pokemonName}</Text>
        <Text style={{ fontSize: 20 }}>Pokemon weight {pokemon.weight}</Text>
      </View>
      <View style={{ height: '30%' }}>
        <Text style={{ fontSize: 20 }}>Kuva</Text>
      </View>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={PokemonsScreen} />
        <Stack.Screen name="Pokemon" component={PokemonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Each of list rows is a navigation link. Thus they are TouchableOpacities, which can be
 * pressed. When pressed, navigation object is used to navigate to Pokemon screen with pokemonId-
 * parameter.
 * **/

const Item = ({ navigation, pokemon }) => (
  <View style={styles.item}>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Pokemon', {
          pokemonName: pokemon.name, //dont pass objects, but id:s to avoid outdated data. use id to fetch fresh data, after navigation
        })
      }>
      <Text style={styles.title}>{pokemon.name}</Text>
    </TouchableOpacity>
  </View>
);

/*
  Function returns pokemon data with title, so that the structure of the
  data is same as in initial mockdata (DATA2 object list)
*/

const pokemonsWithTitle = (pokemons) => {
  return [
    {
      title: 'Pokemons',
      data: pokemons,
    },
  ];
};

const DATA2 = [
  {
    title: 'Pokemons',
    data: [
      { id: 1, name: 'Bulbasaur' },
      { id: 2, name: 'Vulpix' },
    ],
  },
];

const PokemonsScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const getPokemons = async () => {
    try {
      const pokemons = await getPokemonsFromApiAsync();
      const pokemondata = pokemonsWithTitle(pokemons);
      setData(pokemondata);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("get pokemons 2");
    getPokemons();
  }, []);

  if (isLoading === true) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error when retrieving pokemons {JSON.stringify(error)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <Item navigation={navigation} pokemon={item} />
        )}
        /**Remove next, to get rid of the section separator **/
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: 'orange',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});

export default App;
