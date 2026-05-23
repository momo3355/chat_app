import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  Animated, Dimensions, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/MainTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { feedStyles as styles } from '../styles/Feed.styles';
import { ImagePickerSheet } from '../components/ImagePickerSheet';
import { feedFileUpload } from '../services/api/FeedApi';
import useFeedStore from '../services/store/FeedStore';
import useLoginStore from '../services/store/LoginStore';
import { buildImageFiles, getFeedImageUrl } from '../utils/Utils';

const SHEET_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);

const FeedWriteScreenBase: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'FeedWriteScreen'>>();
  const user = useLoginStore(state => state.user);
  const { createFeed, updateFeed, fetchFeed } = useFeedStore();

  const editFeedId = route.params?.editFeedId;
  const isEditMode = !!editFeedId;

  const [content, setContent] = useState(route.params?.initialContent ?? '');
  const [existingImages, setExistingImages] = useState<string[]>(route.params?.initialImages ?? []);
  const [newLocalUris, setNewLocalUris] = useState<string[]>([]);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const pickerHeightAnim = useRef(new Animated.Value(0)).current;

  const totalImageCount = existingImages.length + newLocalUris.length;

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

  const removeExistingImage = useCallback((url: string) => {
    setExistingImages(prev => prev.filter(u => u !== url));
  }, []);

  const removeNewImage = useCallback((uri: string) => {
    setNewLocalUris(prev => prev.filter(u => u !== uri));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user || (!content.trim() && totalImageCount === 0)) return;
    setIsUploading(true);
    try {
      let newImageUrls: string[] = [];
      if (newLocalUris.length > 0) {
        const imageFiles = buildImageFiles(newLocalUris);
        const uploadRes = await feedFileUpload(user.userId, imageFiles);
        if (!uploadRes.success) {
          Alert.alert('오류', uploadRes.errorMsg || '이미지 업로드에 실패했습니다.');
          return;
        }
        newImageUrls = uploadRes.imageUrls;
      }

      if (isEditMode) {
        const finalImageUrls = [...existingImages, ...newImageUrls];
        const success = await updateFeed({
          feedId: editFeedId!,
          userId: user.userId,
          content: content.trim(),
          imageUrls: finalImageUrls,
        });
        if (success) {
          await fetchFeed(user.userId);
          navigation.goBack();
        } else {
          Alert.alert('오류', '게시글 수정에 실패했습니다.');
        }
      } else {
        const success = await createFeed({
          userId: user.userId,
          content: content.trim(),
          imageUrls: newImageUrls,
        });
        if (success) {
          await fetchFeed(user.userId);
          navigation.goBack();
        } else {
          Alert.alert('오류', '게시글 등록에 실패했습니다.');
        }
      }
    } finally {
      setIsUploading(false);
    }
  }, [user, content, existingImages, newLocalUris, isEditMode, editFeedId, createFeed, updateFeed, fetchFeed, navigation, totalImageCount]);

  const canSubmit = (content.trim().length > 0 || totalImageCount > 0) && !isUploading;

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
          <Text style={styles.writeTitle}>{isEditMode ? '소식 수정' : '소식 쓰기'}</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={!canSubmit}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#7c3aed" />
            ) : (
              <Text style={[styles.writeSubmit, !canSubmit && styles.writeSubmitDisabled]}>
                {isEditMode ? '저장' : '등록'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {(existingImages.length > 0 || newLocalUris.length > 0) && (
            <View style={styles.selectedImagesRow}>
              {existingImages.map(url => (
                <View key={url} style={styles.thumbWrapper}>
                  <Image source={{ uri: getFeedImageUrl(url) }} style={styles.selectedThumb} />
                  <TouchableOpacity
                    style={styles.removeThumbBtn}
                    onPress={() => removeExistingImage(url)}
                  >
                    <Icon name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {newLocalUris.map(uri => (
                <View key={uri} style={styles.thumbWrapper}>
                  <Image source={{ uri }} style={styles.selectedThumb} />
                  <TouchableOpacity
                    style={styles.removeThumbBtn}
                    onPress={() => removeNewImage(uri)}
                  >
                    <Icon name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TextInput
            style={styles.textInput}
            placeholder="지금 어떤 생각을 하고 계신가요?"
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
          />
        </ScrollView>

        <View style={styles.writeFooter}>
          <TouchableOpacity style={styles.photoBtn} onPress={openPicker}>
            <Icon name="photo-library" size={22} color="#7c3aed" />
            <Text style={styles.photoBtnText}>사진 ({totalImageCount}/4)</Text>
          </TouchableOpacity>
        </View>

        <ImagePickerSheet
          heightAnim={pickerHeightAnim}
          isVisible={isPickerVisible}
          selectedUris={newLocalUris}
          onSelectionChange={setNewLocalUris}
          onClose={closePicker}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FeedWriteScreen = React.memo(FeedWriteScreenBase);
FeedWriteScreen.displayName = 'FeedWriteScreen';
export default FeedWriteScreen;
