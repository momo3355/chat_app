import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, Alert, ActivityIndicator, Animated, Keyboard, Dimensions,
  Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import { profileEditStyles as styles } from '../styles/ProfileEdit.styles';
import useLoginStore from '../services/store/LoginStore';
import { updateProfile, getMyProfile } from '../services/UserInfoApi';
import { getProfileUrl, REGIONS } from '../utils/Utils';
import { profilePhotoUpload } from '../services/api/LoginApi';
import { ImagePickerSheet } from '../components/ImagePickerSheet';

const AGE_OPTIONS = Array.from({ length: 41 }, (_, i) => i + 20);
const AGE_ITEM_HEIGHT = 44;

const SHEET_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);

const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useLoginStore(state => state.user);
  const updateUser = useLoginStore(state => state.updateUser);

  const [userName, setUserName] = useState(user?.userName ?? '');
  const [greetings, setGreetings] = useState(user?.greetings ?? '');
  const [age, setAge] = useState<number | null>(user?.age ?? null);
  const [ageModalVisible, setAgeModalVisible] = useState(false);

  const genderLabel = user?.gender === 'M' ? '남성' : user?.gender === 'W' ? '여성' : '-';
  const regionLabel = user?.area != null ? (REGIONS[user.area - 1] ?? '-') : '-';
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    getMyProfile().then(profile => {
      const updates: Parameters<typeof updateUser>[0] = {};
      if (profile.area != null) updates.area = profile.area;
      if (profile.greetings !== undefined) {
        updates.greetings = profile.greetings;
        setGreetings(profile.greetings ?? '');
      }
      if (Object.keys(updates).length > 0) updateUser(updates);
    }).catch(() => {});
  }, [updateUser]);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const pickerHeightAnim = useRef(new Animated.Value(0)).current;

  const closePicker = useCallback(() => {
    Animated.timing(pickerHeightAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      setPickerVisible(false);
      setSelectedImages([]);
    });
  }, [pickerHeightAnim]);

  const openPicker = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      pickerHeightAnim.setValue(0);
      setPickerVisible(true);
      Animated.spring(pickerHeightAnim, {
        toValue: SHEET_HEIGHT,
        useNativeDriver: false,
        bounciness: 3,
        speed: 14,
      }).start();
    }, 150);
  }, [pickerHeightAnim]);

  const handleProfileSelection = useCallback(async (uris: string[]) => {
    if (uris.length === 0) return;
    closePicker();
    const uri = uris[uris.length - 1];
    try {
      const cropped = await ImageCropPicker.openCropper({
        path: uri,
        mediaType: 'photo',
        width: 600,
        height: 600,
        cropping: true,
        cropperToolbarTitle: '사진 편집',
        cropperActiveWidgetColor: '#7c3aed',
        cropperStatusBarLight: false,
        cropperToolbarColor: '#7c3aed',
        cropperToolbarWidgetColor: '#ffffff',
      });
      setLocalAvatarUri(cropped.path);
      setAvatarFailed(false);
    } catch (e: any) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('오류', '사진 편집에 실패했습니다.');
      }
    }
  }, [closePicker]);

  const handleSave = useCallback(async () => {
    if (!user || !userName.trim()) return;
    setIsSaving(true);
    try {
      if (localAvatarUri) {
        const name = localAvatarUri.split('/').pop() ?? 'profile.jpg';
        const uploaded = await profilePhotoUpload(user.userId, localAvatarUri, name);
        if (uploaded) {
          updateUser({ profileTs: Date.now() });
        } else {
          Alert.alert('알림', '프로필 사진 업로드에 실패했습니다.');
          setIsSaving(false);
          return;
        }
      }
      const success = await updateProfile({ userName: userName.trim(), greetings: greetings.trim(), age });
      console.log('updateProfile 응답:', success);
      if (success) {
        updateUser({ userName: userName.trim(), greetings: greetings.trim(), age: age ?? undefined });
        navigation.goBack();
      } else {
        Alert.alert('오류', '프로필 저장에 실패했습니다.');
      }
    } catch (e) {
      console.error('프로필 저장 예외:', e);
      Alert.alert('오류', '프로필 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [user, userName, greetings, age, localAvatarUri, updateUser, navigation]);

  const canSave = userName.trim().length > 0 && !isSaving;
  const avatarUri = localAvatarUri ?? getProfileUrl(user?.userId, user?.profileTs);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerCancel}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 프로필</Text>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          {isSaving
            ? <ActivityIndicator size="small" color="#7c3aed" />
            : <Text style={[styles.headerSave, !canSave && styles.headerSaveDisabled]}>저장</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={openPicker} activeOpacity={0.8}>
            {!avatarFailed ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="person" size={44} color="#7c3aed" />
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Icon name="photo-camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>닉네임</Text>
            <TextInput
              style={styles.fieldInput}
              value={userName}
              onChangeText={setUserName}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#ccc"
              maxLength={20}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>한마디</Text>
            <TextInput
              style={styles.fieldInput}
              value={greetings}
              onChangeText={setGreetings}
              placeholder="한마디를 입력하세요"
              placeholderTextColor="#ccc"
              maxLength={100}
            />
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>성별</Text>
            <Text style={styles.fieldDisabledText}>{genderLabel}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>지역</Text>
            <Text style={styles.fieldDisabledText}>{regionLabel}</Text>
          </View>
          <TouchableOpacity
            style={[styles.fieldRow, styles.fieldRowLast]}
            onPress={() => setAgeModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.fieldLabel}>나이</Text>
            <Text style={age != null ? styles.fieldInput : styles.fieldPlaceholder}>
              {age != null ? `${age}세` : '나이를 선택하세요'}
            </Text>
            <Icon name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={ageModalVisible} transparent animationType="fade" onRequestClose={() => setAgeModalVisible(false)}>
        <TouchableOpacity style={styles.ageOverlay} activeOpacity={1} onPress={() => setAgeModalVisible(false)}>
          <TouchableOpacity style={styles.ageModalBox} activeOpacity={1}>
            <Text style={styles.ageModalTitle}>나이 선택</Text>
            <FlatList
              data={AGE_OPTIONS}
              keyExtractor={item => String(item)}
              style={styles.agePicker}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({ length: AGE_ITEM_HEIGHT, offset: AGE_ITEM_HEIGHT * index, index })}
              initialScrollIndex={age != null ? Math.max(0, AGE_OPTIONS.indexOf(age)) : 0}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.ageItem, age === item && styles.ageItemSelected]}
                  onPress={() => { setAge(item); setAgeModalVisible(false); }}
                >
                  <Text style={[styles.ageItemText, age === item && styles.ageItemTextSelected]}>
                    {item}세
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.ageConfirmBtn} onPress={() => setAgeModalVisible(false)}>
              <Text style={styles.ageConfirmBtnText}>확인</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {pickerVisible && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 99 }}>
          <ImagePickerSheet
            heightAnim={pickerHeightAnim}
            isVisible={pickerVisible}
            selectedUris={selectedImages}
            onSelectionChange={handleProfileSelection}
            onClose={closePicker}
            maxSelection={1}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileEditScreen;
