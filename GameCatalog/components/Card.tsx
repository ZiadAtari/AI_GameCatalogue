import React from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";

interface InfoCardProps {
  title: string;
  releaseDate: string;
  cover?: string | null;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, releaseDate, cover }) => {
  return (
    <View style={styles.container}>
      {cover && <Image source={{ uri: cover }} style={styles.coverImage} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.bubble}>{releaseDate}</Text>
      
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 250,
    backgroundColor: "#3C3D37",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        borderWidth: 2,
      },
      web: {
        borderWidth: 0.5,
        shadowColor: "black",
        shadowOffset: {
          width: 6,
          height: 6,
        },
        shadowRadius: 3,
        shadowOpacity: 1.0,
      },
    }),
    padding: 10,
  },
  coverImage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  bubble: {
    textAlign: 'center',
    width: 100,
    fontSize: 14,
    color: "white",
    backgroundColor: '#4b4d46',
    margin: 3,
    padding: 3,
    borderRadius: 10,

  },
});
