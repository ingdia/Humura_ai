import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Humura AI 🌿</Text>

      <Text style={styles.subtitle}>
        A safe space to talk, breathe, and heal.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Check Mood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold"
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginVertical: 20
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  secondaryButton: {
    borderColor: "#22c55e",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center"
  },
  secondaryText: {
    color: "#22c55e"
  }
});