import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setQuestionnaireAnswers } from "../redux/questionnaireSlice";
import { setSearchQuery } from "../redux/gameSlice";
import { router } from "expo-router";

const Questionnaire = () => {
  const [genre, setGenre] = useState("");
  const [mode, setMode] = useState("");
  const [games, setGames] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState("");

  const dispatch = useDispatch();

  // Function to send the user's responses to the AI and handle the response
  const handleComplete = async () => {
    setLoading(true);

    // Save the answers in Redux
    dispatch(setQuestionnaireAnswers({ genre, mode, games }));

    // Construct the prompt to send to the AI
    const prompt = `Suggest a game based on the following preferences: Genre: ${genre}, Mode: ${mode}, Likes: ${games}, Reply with strictly ONE game title with no other text or formatting`;

    // Function to send the prompt to the AI and receive a response
    const sendPrompt = async () => {
      setLoading(true);
      console.log("Sending prompt to server:", prompt); // Debug: Log the prompt being sent

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:latest",
          prompt,
          system: "",
          template: "",
          context: [],
          options: { temperature: 0.8 },
        }),
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:11434/api/generate",
          requestOptions
        );
        const reader = response.body?.getReader();

        if (reader) {
          let accumulatedResponse = "";
          let done = false;

          while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (readerDone) {
              setLoading(false);
              done = true;
              console.log(
                "Finished receiving data from server. Accumulated Response:",
                accumulatedResponse
              ); // Debug: Log final response
              break;
            }

            const decodedValue = new TextDecoder("utf-8").decode(value);
            console.log("Decoded server response chunk:", decodedValue); // Debug: Log each chunk of server response

            try {
              // Split the response by newline characters to handle multiple JSON objects
              const jsonObjects = decodedValue
                .split("\n")
                .filter((line) => line.trim().length > 0);

              for (const jsonObject of jsonObjects) {
                const parsed = JSON.parse(jsonObject);

                if (parsed.response) {
                  accumulatedResponse += parsed.response;
                }

                if (parsed.done) {
                  done = true;
                  setContext(parsed.context || []); // Update context if provided by the server
                }
              }
            } catch (e) {
              console.error(
                "Error parsing JSON. Raw response chunk:",
                decodedValue
              ); // Debug: Log raw response if JSON parsing fails
            }
          }

          // Trim the accumulated response and update the search query
          const trimmedResponse = accumulatedResponse.trim();
          setAIResponse(trimmedResponse);
          console.log("Setting search query to:", trimmedResponse); // Debug: Log the search query being set
          dispatch(setSearchQuery(trimmedResponse)); // Ensure no extra spaces are included
        }
      } catch (error) {
        console.error("Error fetching AI suggestion:", error); // Debug: Log fetch errors
        setLoading(false);
      }
    };

    // Call sendPrompt to get AI's response
    await sendPrompt();

    // Navigate back to the Index page after completion
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bigContainer}>
        <Text style={styles.title}>Questionnaire</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>What Genres do you like?</Text>
          <TextInput
            style={styles.input}
            placeholder="Genre..."
            value={genre}
            onChangeText={setGenre}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>Singleplayer or Multiplayer?</Text>
          <TextInput
            style={styles.input}
            placeholder="Mode..."
            value={mode}
            onChangeText={setMode}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>Games you like? </Text>
          <TextInput
            style={styles.input}
            placeholder="Games..."
            value={games}
            onChangeText={setGames}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={{color: 'white', fontSize: 18,}}>{loading ? "Submitting..." : "Submit"}</Text>
        </TouchableOpacity>
        {aiResponse ? (
          <Text style={styles.responseText}>Suggested Game: {aiResponse}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bigContainer: {
    backgroundColor: "#262623",
    height: 550,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 3,
  },
  questionContainer: {
    margin: 10,
  },
  title: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  questionTitle: {
    color: "white",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 300,
    backgroundColor: "#3C3D37",
    fontSize: 20,
    borderColor: "gray",
    borderWidth: 2,
    padding: 7,
    borderRadius: 10,
    color: "white",
    marginBottom: 20,
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#3C3D37",
    width: 200,
    height: 40,
    color: 'white',
  },
  responseText: {
    color: "white",
    fontSize: 18,
    marginTop: 20,
  },
});

export default Questionnaire;
function setContext(arg0: any) {
  throw new Error("Function not implemented.");
}
