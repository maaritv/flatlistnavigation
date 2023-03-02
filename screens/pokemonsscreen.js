

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { getPokemonsFromApiAsync } from '../services/pokemonservice';


export const PokemonsScreen = ({ navigation }) => {
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
            pokemonUrl: pokemon.url
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
  