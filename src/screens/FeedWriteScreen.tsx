import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  Animated, Dimensions, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/MainTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { feedStyles as styles } from '../styles/Feed.styles';
import { ImagePickerSheet } from '../components/ImagePickerSheet';
import { feedFileUpload } from '../services/api/FeedApi';
import useFeedStore from '../services/store/FeedStore';
import useLoginStore from '../services/store/LoginStore';
import { buildImageFiles } from '../utils/Utils';

const SHEET_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);

const FeedWriteScreenBase: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useLoginStore(state => state.user);
  const { createFeed, fetchFeed } = useFeedStore();

  const [content, setContent] = useState('');
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const pickerHeightAnim = useRef(new Animated.Value(0)).current;

  const openPicker = useCallback(() => {
    pickerHeightAnim.setValue(0);
    setIsPickerVisible(true);
    Animated.spring(pickerHeightAnim, {
      toValue: SHEET_HEIGHT,
      useNativeDriver: false,
      bounciness: 3,
      speed: 14,
    }).start();
  }, [pickerHeightAnim]);

  const closePicker = useCallback(() => {
    Animated.timing(pickerHeightAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setIsPickerVisible(false));
  }, [pickerHeightAnim]);

  const removeImage = useCallback((uri: string) => {
    setSelectedUris(prev => prev.filter(u => u !== uri));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user || (!content.trim() && selectedUris.length === 0)) return;
    setIsUploading(true);
    try {
      let imageUrls: string[] = [];
      if (selectedUris.length > 0) {
        const imageFiles = buildImageFiles(selectedUris);
        const uploadRes = await feedFileUpload(user.userId, imageFiles);
        if (!uploadRes.success) {
          Alert.alert('오류', uploadRes.errorMsg || '이미지 업로드에 실패했습니다.');
          return;
        }
        imageUrls = uploadRes.imageUrls;
      }
      const success = await createFeed({
        userId: user.userId,
        content: content.trim(),
        imageUrls,
      });
      if (success) {
        await fetchFeed(user.userId);
        navigation.goBack();
      } else {
        Alert.alert('오류', '게시글 등록에 실패했습니다.');
      }
    } finally {
      setIsUploading(false);
    }
  }, [user, content, selectedUris, createFeed, fetchFeed, navigation]);

  const canSubmit = (content.trim().length > 0 || selectedUris.length > 0) && !isUploading;

  return (
    <SafeAreaView style={styles.writeContainer} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.writeHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.writeCancel}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.writeTitle}>소식 쓰기</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={!canSubmit}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#7c3aed" />
            ) : (
              <Text style={[styles.writeSubmit, !canSubmit && styles.writeSubmitDisabled]}>
                등록
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.textInput}
            placeholder="지금 어떤 생각을 하고 계신가요?"
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
          />

          {selectedUris.length > 0 && (
            <View style={styles.selectedImagesRow}>
              {selectedUris.map(uri => (
                <View key={uri} style={styles.thumbWrapper}>
                  <Image source={{ uri }} style={styles.selectedThumb} />
                  <TouchableOpacity
                    style={styles.removeThumbBtn}
                    onPress={() => removeImage(uri)}
                  >
                    <Icon name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.writeFooter}>
          <TouchableOpacity style={styles.photoBtn} onPress={openPicker}>
            <Icon name="photo-library" size={22} color="#7c3aed" />
            <Text style={styles.photoBtnText}>사진 ({selectedUris.length}/4)</Text>
          </TouchableOpacity>
        </View>

        <ImagePickerSheet
          heightAnim={pickerHeightAnim}
          isVisible={isPickerVisible}
          selectedUris={selectedUris}
          onSelectionChange={setSelectedUris}
          onClose={closePicker}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FeedWriteScreen = React.memo(FeedWriteScreenBase);
FeedWriteScreen.displayName = 'FeedWriteScreen';
export default FeedWriteScreen;
