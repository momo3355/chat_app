import { View, FlatList, Keyboard, Platform, Alert, Text, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { styles, uploadOverlayStyles } from '../styles/ChatMessge.styles';
import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { ImagePickerSheet } from '../components/ImagePickerSheet';
import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessgeInfoValue } from '../types/MessgeTypes';
import { getDateKey, getDateLabel, buildImageFiles } from '../utils/Utils';

type ChatItem =
  | { type: 'message'; data: MessgeInfoValue }
  | { type: 'separator'; dateLabel: string };
import { MainStackParamList } from '../types/MainTypes.ts';
import useChatWebSocket from '../hooks/useChatWebSocket';
import useChatStore from '../services/store/ChatStore';
import useAppState from '../hooks/useAppState';

type ChatScreenRouteProp = RouteProp<MainStackParamList, 'ChatScreen'>;

const SHEET_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChatScreen() {
const navigation = useNavigation();
const route = useRoute<ChatScreenRouteProp>();
const { userId, userName, roomId, roomName, token } = route.params;

const { messages, isConnected, sendMessage, disconnect, reconnect, mergePendingMessages, appendOlderMessages } = useChatWebSocket({ userId, userName, roomId, token });

const loadPendingMessages = useCallback(async () => {
  const key = `pending_messages_${roomId}`;
  const stored = await AsyncStorage.getItem(key);
  if (stored) {
    const pendingMessages: MessgeInfoValue[] = JSON.parse(stored);
    mergePendingMessages(pendingMessages);
    await AsyncStorage.removeItem(key);
  }
}, [roomId, mergePendingMessages]);

useAppState(
  useCallback(() => {
    reconnect();
    loadPendingMessages();
  }, [reconnect, loadPendingMessages]),
  useCallback(() => {
    disconnect();
  }, [disconnect]),
);

const { loadMessgeInfoPosts, chatFileUpload } = useChatStore();

const [lastMessageId, setLastMessageId] = useState(0);
const [isLoadingMore, setIsLoadingMore] = useState(false);
const [hasMore, setHasMore] = useState(true);
const [isInitialLoading, setIsInitialLoading] = useState(true);
const listRevealedRef = useRef(false);
const loadingAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (!isConnected) {
    const anim = Animated.loop(
      Animated.timing(loadingAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
    );
    anim.start();
    return () => { anim.stop(); loadingAnim.setValue(0); };
  }
}, [isConnected, loadingAnim]);

useEffect(() => {
  const loadHistory = async () => {
    const res = await loadMessgeInfoPosts({id: 0, sender: userId, roomId });
    const list = res.messageInfoList ?? [];
    if (res.success && list.length > 0) {
      mergePendingMessages(list);
      const oldest = list[list.length - 1];
      if (oldest.id) { setLastMessageId(oldest.id); }
    } else if (res.success && list.length === 0) {
      setHasMore(false);
      setIsInitialLoading(false);
    } else if (!res.success) {
      Alert.alert('오류', res.errorMsg || '메시지를 불러오는 데 실패했습니다.');
      setHasMore(false);
      setIsInitialLoading(false);
    }
  };
  loadHistory();
}, [roomId, userId, loadMessgeInfoPosts, mergePendingMessages]);

useEffect(() => {
  if (messages.length > 0 && !listRevealedRef.current) {
    listRevealedRef.current = true;
    requestAnimationFrame(() => setIsInitialLoading(false));
  }
}, [messages]);

const loadMoreHistory = useCallback(async () => {
  if (isLoadingMore || !hasMore || lastMessageId === 0) { return; }
  setIsLoadingMore(true);
  try {
    const res = await loadMessgeInfoPosts({id: lastMessageId, sender: userId, roomId });
    const list = res.messageInfoList ?? [];
    if (res.success && list.length > 0) {
      appendOlderMessages(list);
      const oldest = list[list.length - 1];
      if (oldest.id) { setLastMessageId(oldest.id); }
    } else {
      setHasMore(false);
    }
  } finally {
    setIsLoadingMore(false);
  }
}, [isLoadingMore, hasMore, lastMessageId, loadMessgeInfoPosts, appendOlderMessages, userId, roomId]);

const [inputMessage, setInputMessage] = useState('');
const [keyboardHeight, setKeyboardHeight] = useState(0);
const [pickerVisible, setPickerVisible] = useState(false);
const [selectedImages, setSelectedImages] = useState<string[]>([]);
const [isUploading, setIsUploading] = useState(false);
const pickerHeightAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener(
    Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
    (e) => { setKeyboardHeight(e.endCoordinates.height); }
  );
  const keyboardDidHideListener = Keyboard.addListener(
    Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
    () => { setKeyboardHeight(0); }
  );
  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);

const closePicker = useCallback((callback?: () => void) => {
  Animated.timing(pickerHeightAnim, {
    toValue: 0,
    duration: 220,
    useNativeDriver: false,
  }).start(() => {
    setPickerVisible(false);
    callback?.();
  });
}, [pickerHeightAnim]);

const togglePicker = useCallback(() => {
  if (pickerVisible) {
    setSelectedImages([]);
    closePicker();
  } else {
    Keyboard.dismiss();
    setPickerVisible(true);
    Animated.spring(pickerHeightAnim, {
      toValue: SHEET_HEIGHT,
      useNativeDriver: false,
      bounciness: 3,
      speed: 14,
    }).start();
  }
}, [pickerVisible, pickerHeightAnim, closePicker]);


const handleSend = useCallback(async () => {
  if (isUploading) { return; }

  if (selectedImages.length > 0) {
    setIsUploading(true);
    const imageFiles = buildImageFiles(selectedImages);
    try {
      const res = await chatFileUpload({ id: 0, roomId, sender: userId, imageFiles });
      if (res.success) {
        if (!isConnected) {
          reconnect();
        }
        imageFiles.forEach((file, index) => {
          const imageInfo = res.messageInfoList?.[index]?.imageInfo || file.name;
          sendMessage('IMAGE', '', imageInfo);
        });
        setSelectedImages([]);
        closePicker();
      } else {
        Alert.alert('업로드 실패', res.errorMsg || '파일 업로드에 실패했습니다.');
      }
    } catch {
      Alert.alert('오류', '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  }

  if (inputMessage.trim()) {
    sendMessage('TALK', inputMessage);
    setInputMessage('');
  }
}, [isUploading, selectedImages, inputMessage, sendMessage, closePicker, chatFileUpload, roomId, userId, isConnected, reconnect]);

const chatItems = useMemo((): ChatItem[] => {
  const items: ChatItem[] = [];
  messages.forEach((msg, index) => {
    items.push({ type: 'message', data: msg });
    const nextMsg = messages[index + 1];
    if (!nextMsg || getDateKey(msg.cretDate) !== getDateKey(nextMsg.cretDate)) {
      items.push({ type: 'separator', dateLabel: getDateLabel(msg.cretDate) });
    }
  });
  return items;
}, [messages]);

const renderItem = useCallback(({ item }: { item: ChatItem }) => {
  if (item.type === 'separator') {
    return (
      <View style={styles.dateSeparatorContainer}>
        <View style={styles.dateSeparatorBadge}>
          <Text style={styles.dateSeparatorText}>{item.dateLabel}</Text>
        </View>
      </View>
    );
  }
  return <ChatMessage item={item.data} isMyMessage={item.data.sender === userId} />;
}, [userId]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ChatHeader
        onBack={() => navigation.goBack()}
        isConnected={isConnected}
        title={roomName}
        onLeave={() =>
          Alert.alert(
            '대화방 나가기',
            '대화방을 나가시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { text: '나가기', style: 'destructive', onPress: () => navigation.goBack() },
            ],
          )
        }
      />
      <View style={{ flex: 1 }}>
        <FlatList
          style={[styles.messagesList, isInitialLoading && { opacity: 0 }]}
          data={chatItems}
          renderItem={renderItem}
          keyExtractor={(item) => {
            if (item.type === 'separator') { return `sep_${item.dateLabel}`; }
            const msg = item.data;
            if (msg.id) { return `msg_${msg.id}`; }
            return `msg_${msg.cretDate ?? ''}_${msg.sender ?? ''}_${(msg.message || msg.imageInfo || '').slice(0, 20)}`;
          }}
          contentContainerStyle={styles.messagesContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          inverted={true}
          onEndReached={loadMoreHistory}
          onEndReachedThreshold={0.3}
        />
        <View style={{ backgroundColor: '#FFFFFF', paddingBottom: keyboardHeight }}>
          <ChatInput
            inputMessage={inputMessage}
            onChangeText={setInputMessage}
            onSend={handleSend}
            onImageButtonPress={togglePicker}
            selectedImages={selectedImages}
            pickerVisible={pickerVisible}
            disabled={!isConnected || isUploading}
            isUploading={isUploading}
          />
        </View>
      </View>

      {!isConnected && !isUploading && (
        <View style={styles.loadingBarContainer}>
          <Animated.View
            style={[styles.loadingBarIndicator, {
              transform: [{
                translateX: loadingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-SCREEN_WIDTH * 0.5, SCREEN_WIDTH],
                }),
              }],
            }]}
          />
        </View>
      )}

      <ImagePickerSheet
        heightAnim={pickerHeightAnim}
        isVisible={pickerVisible}
        selectedUris={selectedImages}
        onSelectionChange={setSelectedImages}
        onClose={() => { setSelectedImages([]); closePicker(); }}
      />

      {isUploading && (
        <View style={uploadOverlayStyles.overlay}>
          <View style={uploadOverlayStyles.box}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={uploadOverlayStyles.text}>업로드 중...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

