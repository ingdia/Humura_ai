import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Post {
  id: string;
  content: string;
  tag: string;
  reactions: { heart: number; hands: number };
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Family pressure is real. Anyone else feeling overwhelmed?",
      tag: "#family",
      reactions: { heart: 5, hands: 3 },
    },
    {
      id: "2",
      content: "Overcame my anxiety today. Small steps matter.",
      tag: "#recovery",
      reactions: { heart: 8, hands: 2 },
    },
  ]);
  const [newPost, setNewPost] = useState("");

  const addPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        content: newPost,
        tag: "#general",
        reactions: { heart: 0, hands: 0 },
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const reactToPost = (id: string, type: "heart" | "hands") => {
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, reactions: { ...post.reactions, [type]: post.reactions[type] + 1 } }
        : post
    ));
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postTag}>{item.tag}</Text>
      <View style={styles.reactions}>
        <TouchableOpacity onPress={() => reactToPost(item.id, "heart")} style={styles.reaction}>
          <Ionicons name="heart" size={20} color='#4a90e2' />
          <Text style={styles.reactionText}>{item.reactions.heart}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reactToPost(item.id, "hands")} style={styles.reaction}>
          <Ionicons name="hand-left" size={20} color='#4a90e2' />
          <Text style={styles.reactionText}>{item.reactions.hands}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Feed</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={newPost}
          onChangeText={setNewPost}
          placeholder="Share how you feel..."
          placeholderTextColor="#666666"
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={addPost} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
      />
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    color: "#333333",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  postButton: {
    backgroundColor: '#4a90e2', // New Blue
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  feed: {
    paddingBottom: 20,
  },
  post: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    color: "#333333",
    fontSize: 16,
    marginBottom: 5,
  },
  postTag: {
    color: '#4a90e2', // New Blue
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reactions: {
    flexDirection: "row",
  },
  reaction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  reactionText: {
    color: "#666666",
    marginLeft: 5,
  },
});