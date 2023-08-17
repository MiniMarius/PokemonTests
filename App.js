import React, { useState, useEffect } from "react";
import TypeToColor from "./Colormapping";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";

export default function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
      const json = await response.json();

      const detailsPromises = json.results.map(async (pokemon) => {
        const detailsResponse = await fetch(pokemon.url);
        const detailsJson = await detailsResponse.json();
        return detailsJson;
      });

      const detailsData = await Promise.all(detailsPromises);
      setPokemonData(detailsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/background.jpg")}
        resizeMode="cover"
        style={styles.bgimage}
      ></ImageBackground>
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={require("./assets/pokemonlogo.png")}
        />
      </View>
      <ScrollView style={styles.gridContainer}>
        {isLoading ? (
          <ActivityIndicator style={styles.loadingspinner}></ActivityIndicator>
        ) : (
          <View style={styles.grid}>
            {pokemonData.map((pokemon, index) => {
              const pokemonType = pokemon.types[0].type.name;
              const bgColor = TypeToColor[pokemonType];
              return (
                <View
                  key={index}
                  style={[styles.box, { backgroundColor: bgColor }]}
                >
                  <Image
                    style={styles.pokeImage}
                    source={{
                      uri: pokemon.sprites.front_default,
                    }}
                  />
                  <Text style={styles.text}>{pokemon.name}</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    padding: 50,
  },
  gridContainer: {
    width: "100%",
  },
  image: {
    width: 150,
    height: 60,
  },
  bgimage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  box: {
    height: 150,
    width: 150,
    alignItems: "center",
    borderRadius: 15,
    margin: 10,
  },
  pokeImage: {
    height: 100,
    width: 100,
  },
  text: {
    fontSize: 18,
  },
});
