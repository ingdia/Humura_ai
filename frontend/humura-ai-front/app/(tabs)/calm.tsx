import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";

export default function CalmScreen() {
  const [breathing, setBreathing] = useState(true);
  const scale = new Animated.Value(1);

  useEffect(() => {
    if (!breathing) return;

    const loop = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.4,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (breathing) loop();
      });
    };

    loop();
  }, [breathing]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calm Mode 🌿</Text>

      <Text style={styles.subtitle}>
        Follow the circle. Breathe slowly.
      </Text>

      <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />

      <Text style={styles.guide}>
        Inhale... hold... exhale...
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setBreathing(!breathing)}
      >
        <Text style={styles.buttonText}>
          {breathing ? "Pause" : "Resume"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        You are safe here 🌿 Take your time.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#333333", // Dark Gray
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666666", // Medium Gray
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4a90e2', // New Blue
    opacity: 0.6,
    marginVertical: 30,
  },
  guide: {
    color: "#333333", // Dark Gray
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#F0F0F0", // Light Gray
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC", // Gray
  },
  buttonText: {
    color: '#4a90e2', // New Blue
    fontWeight: "bold",
  },
  footer: {
    color: "#666666", // Medium Gray
    marginTop: 30,
    textAlign: "center",
  },
});