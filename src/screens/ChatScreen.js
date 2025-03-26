import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import styles from '../styles/styles';
import { sendChatMessage } from '../utils/api';

export default function ChatScreen({ navigation, route }) {
  const { geminiKey } = route.params;
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseCache, setResponseCache] = useState({});

  // Set default message when the component mounts
  useEffect(() => {
    setChatMessages([
      {
        text: "Hello! I'm Zestix, your Cooking Assistant. How can I help you with cooking today?",
        sender: 'bot',
      },
    ]);
  }, []);

  // Parse text for bold formatting
  const renderMessageText = (text) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        const boldText = part.slice(1, -1);
        return <Text key={index} style={styles.boldText}>{boldText}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = { text: chatInput, sender: 'user' };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    Keyboard.dismiss();

    const queryKey = chatInput.trim().toLowerCase();

    // Check cache first
    if (responseCache[queryKey]) {
      setChatMessages((prev) => [...prev, { text: responseCache[queryKey], sender: 'bot' }]);
      return;
    }

    // Call API with system instruction
    setIsLoading(true);
    sendChatMessage(chatInput, setChatMessages, geminiKey, (response) => {
      setIsLoading(false);
      if (response) {
        setResponseCache((prev) => ({ ...prev, [queryKey]: response }));
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.chatScreenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
      enabled
    >
      <View style={styles.chatHeader}>
        <Image
          source={require('../../assets/idle.png')}
          style={styles.headerImage}
        />
      </View>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.chatBubble,
              item.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.chatText}>{renderMessageText(item.text)}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatListContent}
        style={styles.chatListFull}
      />
      {isLoading && (
        <Text style={styles.loadingText}>Zestix is thinking...</Text>
      )}
      <View style={styles.chatInputContainerFull}>
        <TextInput
          style={styles.chatInputFull}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Ask about cooking recipes..."
          placeholderTextColor="#999"
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButtonFull} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}