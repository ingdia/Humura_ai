import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [anonymous, setAnonymous] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.setting}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color='#4a90e2' />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingLeft}>
            <Ionicons name="eye-off" size={24} color='#4a90e2' />
            <Text style={styles.settingText}>Stay Anonymous</Text>
          </View>
          <Switch value={anonymous} onValueChange={setAnonymous} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="help-circle" size={24} color='#4a90e2' />
          <Text style={styles.optionText}>Help & FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Ionicons name="information-circle" size={24} color='#4a90e2' />
          <Text style={styles.optionText}>About Humura</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    color: "#333333",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#666666",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    color: "#333333",
    fontSize: 16,
    marginLeft: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: "#333333",
    fontSize: 16,
    marginLeft: 10,
  },
  logout: {
    backgroundColor: '#4a90e2', // New Blue
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});