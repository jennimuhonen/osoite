import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { useState } from 'react';

/*
Lähteet:
- Kurssimateriaali: https://haagahelia.github.io/mobilecourse/ + luennot
- Geocoding API: https://geocode.maps.co/
- ChatGPT: pientä virheenkorjausta
*/


export default function App() {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("Rautatieasema");
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(60.17189348213929)
  const [lon, setLon] = useState(24.941338478438446)

  const initialRegion = {
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  }

  const apikey = process.env.EXPO_PUBLIC_API_KEY;

  const searchAddress = async () => {
    
    try {
      setLoading(true)
      console.log(input);

      const response = await fetch("https://geocode.maps.co/search?q=" + input + "&api_key=" + 	apikey);

      if (!response.ok) {
        throw new Error("Error in fetch: " + response.statusText)
      }

      const data = await response.json();
      console.log(data);
      console.log(data[0].lat);
      console.log(data[0].lon);
      setLat(Number(data[0].lat));
      setLon(Number(data[0].lon));
      setTitle(input);

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <MapView
          style={styles.map}
          region={initialRegion}
        >
          <Marker
            coordinate={initialRegion}
            title={title}
          />
        </MapView>
        <TextInput
          style={styles.textInput}
          placeholder='Anna osoite'
          onChangeText={text => setInput(text)}
          value={input}
        />
        {loading && <ActivityIndicator size="large" />}
        <Pressable style={styles.button} onPress={searchAddress}>
          <Text>Näytä</Text>
        </Pressable>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '85%',
  },
  textInput: {
    borderBottomWidth: 1,
    width: '98%',
    marginBottom: 5,
  },
  button: {
    paddingVertical: 8,
    backgroundColor: 'lightblue',
    marginHorizontal: 1,
    width: '100%',
    alignItems: 'center',
  },
});
