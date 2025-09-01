import React, { useEffect } from "react";
import { Text, View, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchGameDetail } from "../redux/gameDetailSlice";
import { generateGameDescription, generateGameReview } from "../redux/gameAIDetailsSlice";
import { selectPreferences } from "../redux/questionnaireSlice"; // For user preferences

const GameScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { detail, loading, error } = useSelector((state: RootState) => state.gameDetail);
  const selectedGameId = useSelector((state: RootState) => state.game.selectedGameId);

  const userPreferences = useSelector(selectPreferences);
  const {
    description = '',  // Default to empty string if undefined
    review = '',  // Default to empty string if undefined
    loadingDescription = false,  // Default to false if undefined
    loadingReview = false,  // Default to false if undefined
    error: aiError = null,  // Default to null if undefined
  } = useSelector((state: RootState) => state.gameAI || {});  // Safely destructure gameAI state
  
  useEffect(() => {
    if (selectedGameId !== null) {
      dispatch(fetchGameDetail(selectedGameId));
    }
  }, [dispatch, selectedGameId]);

  useEffect(() => {
    if (detail?.name && selectedGameId !== null) {
      dispatch(generateGameDescription(detail.name));
      dispatch(generateGameReview({ gameName: detail.name, preferences: userPreferences }));
    }
  }, [detail, selectedGameId, userPreferences, dispatch]);

  return (
    <ScrollView style={styles.container}>
      {loading && <Text style={styles.text}>Loading...</Text>}
      {error && <Text style={styles.text}>{error}</Text>}
      {detail && (
        <View style={styles.detailContainer}>
          {detail.background_image && (
            <Image
              source={{ uri: detail.background_image }}
              style={styles.image}
            />
          )}
          <Text style={styles.title}>{detail.name}</Text>
          <Text style={styles.text}>{detail.released}</Text>
          <Text style={styles.rating}>Metacritic Rating: {detail.rating}⭐</Text>

          <View style={styles.gameDescription}>
            <Text style={styles.descTitle}>Overview</Text>
            {loadingDescription ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          <View style={styles.gameReview}>
            <Text style={styles.descTitle}>Review</Text>
            {loadingReview ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.description}>{review}</Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1B1B1B",
      padding: 10
    },
    detailContainer: {
      alignItems: "center"
    },
    image: {
      width: "100%",
      height: 350,
      borderRadius: 10,
      resizeMode: "cover"
    },
    title: {
      fontSize: 30,
      color: "white",
      marginVertical: 10
    },
    gameDescription: {
      margin: 10,
      padding: 10,
      paddingBottom: 20,
      borderWidth: 2,
      borderRadius: 15,
      backgroundColor: '#3C3D37'
    },
    gameReview: {
      margin: 10,
      padding: 10,
      paddingBottom: 20,
      borderWidth: 2,
      borderRadius: 15,
      backgroundColor: '#3C3D37'
    },
    description: {
      color: "white",
      paddingHorizontal: 15
    },
    text: {
      textAlign: "center",
      fontSize: 18,
      color: "white"
    },
    rating: {
      textAlign: "center",
      fontSize: 18,
      color: "white"
    },
    descTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
      paddingHorizontal: 15,
      marginBottom: 5
    }
  });

export default GameScreen;
