import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import InfoCard from '../components/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchGames, setSelectedGameId, setSearchQuery, searchGames } from '../redux/gameSlice';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { router } from 'expo-router';
import SearchBar from '../components/SearchBar';
import debounce from 'lodash.debounce';  // Import debounce function from lodash

function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { games, filteredGames, loading, error, searchQuery } = useSelector((state: RootState) => state.game);
  
  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  // Debounced search handler to limit API requests
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.trim() !== '') {
        dispatch(searchGames(text));
      }
    }, 300),  // Adjust debounce delay as needed
    [dispatch]
  );

  const handleSearch = (text: string) => {
    console.log('Search text input:', text); // Debug: Log the search text input
    dispatch(setSearchQuery(text)); 
    debouncedSearch(text);  // Call debounced search function
  };

  const handlePress = (gameId: number) => {
    dispatch(setSelectedGameId(gameId));
    router.push('/gameScreen');
  };

  const goToQuestionnaire = () => {
    router.push('/Questionnaire');
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Welcome User01</Text>
        </View>

        <View style={{ padding: 20 }}>
          <View  style={styles.utilityBar}>
            <SearchBar query={searchQuery} onChange={handleSearch} />

            <TouchableOpacity style={styles.button} onPress={goToQuestionnaire}>
              <Text style={styles.buttonText}>Quiz</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.headerText}>Explore Games</Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : error ? (
            <View>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchGames())}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardDeck}>
              {filteredGames.map((game) => (
                <TouchableOpacity key={game.id} onPress={() => handlePress(game.id)}>
                  <InfoCard
                    title={game.name}
                    releaseDate={game.released}
                    cover={game.cover?.url || null}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B1B1B',
  },
  titleBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 20,
    height: 200,
    padding: 20,
  },
  utilityBar: {
    borderWidth: 3,
    flexDirection:  'row-reverse',
    paddingHorizontal: 10,
    
  },
  cardDeck: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    marginBottom: 20,
  },
  title: {
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    alignSelf:  'center',
    backgroundColor: '#3C3D37',
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
