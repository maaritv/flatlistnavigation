import * as React from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';

export const PokemonMovesScreen = ({ route, navigation }) => {
    const { pokemonName, moves } = route.params;

     console.log("moves are "+JSON.stringify(moves))

    const moveList = moves.map((move, index) => <Text key={index} style={{height: '2%', fontSize: 20}}>{move.move.name}</Text>)

return (<View style={{display: "flex"}}>
    <ScrollView style={{display: "flex", backgroundColor: "#CCCCCC"}}>
    {moveList}
   </ScrollView>
   </View>)

}