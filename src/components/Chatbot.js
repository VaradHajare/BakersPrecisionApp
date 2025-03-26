import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { sendChatMessage } from '../utils/api';
import styles from '../styles/styles';

export default function Chatbot({ geminiKey }) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I’m your baking assistant. How can I help you today?" , sender: 'bot' },
  ]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { text: chatInput, sender: 'user' };
    setChatMessages((prev) => [...prev, userMessage]);

    await sendChatMessage(chatInput, setChatMessages, geminiKey);
    setChatInput('');
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.chatBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.chatText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.chatCard}>
      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatList}
      />
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your baking question..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}