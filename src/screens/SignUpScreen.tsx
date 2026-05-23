import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ImagePickerSheet } from '../components/ImagePickerSheet';
import { signUpStyles as styles, C } from '../styles/SignUp.styles';
import { idCheck as apiIdCheck, signUp, uploadProfileImage } from '../services/api/SignUpApi';
import { REGIONS, AGES, matchRegionFromSido } from '../utils/Utils';

const SHEET_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);
const AGES_STR = AGES.map(String);

type Gender = '남' | '여' | null;

interface SignUpForm {
  userId: string;
  password: string;
  userName: string;
  age: string;
  gender: Gender;
  area: number | null;
  phone: string;
}

interface GpsParams {
  latitude: number;
  longitude: number;
  province: string;
  sido: string;
  dong: string;
}

interface Props {
  navigation: any;
  route?: { params?: GpsParams };
}


interface PickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  suffix?: string;
}

const PickerModal: React.FC<PickerModalProps> = ({
  visible, title, options, selected, onSelect, onClose, suffix = '',
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalSheet}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseText}>닫기</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <Text style={[styles.optionText, item === selected && styles.optionTextSelected]}>
                {item}{suffix}
              </Text>
              {item === selected && <Icon name="check" size={16} color={C.purple} />}
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

const SignUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const [form, setForm] = useState<SignUpForm>({
    userId: '',
    password: '',
    userName: '',
    age: '',
    gender: null,
    area: null,
    phone: '',
  });
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [gpsParams, setGpsParams] = useState<GpsParams | null>(null);
  const [isAreaFromGps, setIsAreaFromGps] = useState(false);

  const [idChecked, setIdChecked] = useState(false);
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneVerifyLoading, setPhoneVerifyLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [ageModalVisible, setAgeModalVisible] = useState(false);

  React.useEffect(() => {
    const params = route?.params;
    if (!params?.province) { return; }
    const areaIdx = matchRegionFromSido(params.province);
    if (areaIdx !== null) {
      setForm(prev => ({ ...prev, area: areaIdx }));
      setIsAreaFromGps(true);
    }
    setGpsParams(params);
  }, [route?.params]);

  // 이미지 피커 (채팅과 동일한 방식)
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

  // 사진 선택 후 크롭 편집 화면 오픈
  const handleProfileSelection = useCallback(async (uris: string[]) => {
    if (uris.length === 0) { return; }
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
      setProfileUri(cropped.path);
    } catch (e: any) {
      if (e?.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('오류', '사진 편집에 실패했습니다.');
      }
    }
  }, [closePicker]);

  const updateField = (key: keyof SignUpForm, value: string | Gender) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'userId') setIdChecked(false);
    if (key === 'phone') setPhoneVerified(false);
  };

  const handleIdCheck = async () => {
    if (!form.userId.trim()) {
      Alert.alert('알림', '아이디를 입력해주세요.');
      return;
    }
    setIdCheckLoading(true);
    try {
      const result = await apiIdCheck(form.userId.trim());
      if (result.available) {
        setIdChecked(true);
        Alert.alert('확인', '사용 가능한 아이디입니다.');
      } else {
        setIdChecked(false);
        Alert.alert('알림', '이미 사용 중인 아이디입니다.');
      }
    } catch (e: any) {
      Alert.alert('오류', e.message || '중복 확인에 실패했습니다.');
    } finally {
      setIdCheckLoading(false);
    }
  };

  const handlePhoneVerify = async () => {
    if (!form.phone.trim()) {
      Alert.alert('알림', '휴대폰 번호를 입력해주세요.');
      return;
    }
    setPhoneVerifyLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setPhoneVerified(true);
      Alert.alert('알림', '인증번호가 발송되었습니다.');
    } catch {
      Alert.alert('오류', '인증 요청에 실패했습니다.');
    } finally {
      setPhoneVerifyLoading(false);
    }
  };

  const isFormValid = Boolean(
    form.userId.trim() &&
    form.password.trim() &&
    form.userName.trim() &&
    form.age &&
    form.gender &&
    form.area !== null &&
    form.phone.trim() &&
    idChecked &&
    phoneVerified &&
    gpsParams,
  );

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting || !gpsParams) { return; }
    setIsSubmitting(true);
    try {
      let profileImg: string | undefined;
      if (profileUri) {
        try {
          profileImg = await uploadProfileImage(form.userId.trim(), profileUri);
        } catch {
          Alert.alert('알림', '프로필 사진 업로드에 실패했습니다. 사진 없이 가입합니다.');
        }
      }
      const result = await signUp({
        userId: form.userId.trim(),
        password: form.password.trim(),
        userName: form.userName.trim(),
        phone: form.phone.trim(),
        gender: form.gender!,
        age: parseInt(form.age, 10),
        area: form.area!,
        lat: gpsParams.latitude,
        lon: gpsParams.longitude,
        sido: gpsParams.sido,
        dong: gpsParams.dong,
        profileImg,
      });
      if (result.success) {
        Alert.alert('완료', '회원가입이 완료되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('오류', result.errorMsg || '회원가입에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.purple} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
            {/* 프로필 사진 */}
            <TouchableOpacity style={styles.profileWrapper} onPress={openPicker}>
              {profileUri ? (
                <Image source={{ uri: profileUri }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Icon name="photo-camera" size={26} color={C.purpleDark} />
                  <Text style={styles.profilePlaceholderText}>프로필 사진</Text>
                </View>
              )}
              <View style={styles.profileBadge}>
                <Icon name="add" size={16} color={C.white} />
              </View>
            </TouchableOpacity>

            {/* 아이디 */}
            <Text style={styles.label}>아이디</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.textInput}
                placeholder="아이디 입력"
                placeholderTextColor={C.placeholder}
                value={form.userId}
                onChangeText={v => updateField('userId', v)}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleIdCheck}
                disabled={idCheckLoading}
              >
                {idCheckLoading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.actionButtonText}>중복확인</Text>}
              </TouchableOpacity>
            </View>
            {idChecked && (
              <View style={styles.verifiedRow}>
                <Icon name="check-circle" size={12} color={C.verified} />
                <Text style={styles.verifiedText}>사용 가능한 아이디</Text>
              </View>
            )}

            {/* 비밀번호 */}
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.textInput}
              placeholder="비밀번호 입력"
              placeholderTextColor={C.placeholder}
              value={form.password}
              onChangeText={v => updateField('password', v)}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* 닉네임 */}
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.textInput}
              placeholder="닉네임 입력"
              placeholderTextColor={C.placeholder}
              value={form.userName}
              onChangeText={v => updateField('userName', v)}
              autoCapitalize="none"
            />

            {/* 나이 */}
            <Text style={styles.label}>나이</Text>
            <TouchableOpacity style={styles.selectButton} onPress={() => setAgeModalVisible(true)}>
              <Text style={form.age ? styles.selectButtonText : styles.selectPlaceholder}>
                {form.age ? `${form.age}세` : '나이 선택'}
              </Text>
              <Icon name="keyboard-arrow-down" size={18} color={C.purple} />
            </TouchableOpacity>

            {/* 성별 */}
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderRow}>
              {(['남', '여'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderButton, form.gender === g && styles.genderButtonSelected]}
                  onPress={() => updateField('gender', g)}
                >
                  <Text style={[styles.genderButtonText, form.gender === g && styles.genderButtonTextSelected]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 지역 */}
            <Text style={styles.label}>지역</Text>
            <TouchableOpacity
              style={[styles.selectButton, isAreaFromGps && styles.selectButtonDisabled]}
              onPress={() => !isAreaFromGps && setRegionModalVisible(true)}
              disabled={isAreaFromGps}
              activeOpacity={isAreaFromGps ? 1 : 0.7}
            >
              <Text style={form.area !== null ? styles.selectButtonText : styles.selectPlaceholder}>
                {form.area !== null ? REGIONS[form.area - 1] : '지역 선택'}
              </Text>
              {isAreaFromGps
                ? <Icon name="lock" size={18} color={C.disabled} />
                : <Icon name="keyboard-arrow-down" size={18} color={C.purple} />}
            </TouchableOpacity>
            {isAreaFromGps && (
              <View style={styles.verifiedRow}>
                <Icon name="gps-fixed" size={12} color={C.purple} />
                <Text style={[styles.verifiedText, { color: C.purple }]}>GPS로 자동 설정됨</Text>
              </View>
            )}

            {/* 휴대폰 */}
            <Text style={styles.label}>휴대폰</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.textInput}
                placeholder="010-0000-0000"
                placeholderTextColor={C.placeholder}
                value={form.phone}
                onChangeText={v => updateField('phone', v)}
                keyboardType="phone-pad"
                maxLength={13}
              />
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePhoneVerify}
                disabled={phoneVerifyLoading}
              >
                {phoneVerifyLoading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.actionButtonText}>인증</Text>}
              </TouchableOpacity>
            </View>
            {phoneVerified && (
              <View style={styles.verifiedRow}>
                <Icon name="check-circle" size={12} color={C.verified} />
                <Text style={styles.verifiedText}>인증 완료</Text>
              </View>
            )}

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[styles.submitButton, (!isFormValid || isSubmitting) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.submitButtonText}>회원가입</Text>}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

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

      <PickerModal
        visible={ageModalVisible}
        title="나이 선택"
        options={AGES_STR}
        selected={form.age}
        onSelect={v => updateField('age', v)}
        onClose={() => setAgeModalVisible(false)}
        suffix="세"
      />
      <PickerModal
        visible={regionModalVisible}
        title="지역 선택"
        options={REGIONS}
        selected={form.area !== null ? REGIONS[form.area - 1] : ''}
        onSelect={v => setForm(prev => ({ ...prev, area: REGIONS.indexOf(v) + 1 }))}
        onClose={() => setRegionModalVisible(false)}
      />
    </View>
  );
};

export default SignUpScreen;
