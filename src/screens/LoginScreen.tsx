// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { styles, Colors } from '../styles/Login.styles';
import { LoginFormData, LoginScreenProps } from '../types/LoginTypes';
import useLoginStore from '../services/store/LoginStore';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    userId: '',
    password: '',
  });

  const { login, isLoading, errorMsg, clearError } = useLoginStore();

  const isFormValid = formData.userId.length > 0 && formData.password.length > 0;

  const handleLogin = async () => {
    if (isFormValid) {
      const success = await login(formData);
      if (success) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        Alert.alert('로그인 실패', errorMsg || '로그인에 실패했습니다.');
        clearError();
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate('LocationTerms');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryPurple} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.appTitle}>My 채팅</Text>

          {/* Email Input */}
          <TextInput
            style={styles.textInput}
            placeholder="아이디"
            placeholderTextColor={Colors.placeholderText}
            value={formData.userId}
            onChangeText={(text) => setFormData({ ...formData, userId: text })}            
            autoCapitalize="none"
          />

          {/* Password Input */}
          <TextInput
            style={styles.textInput}
            placeholder="비밀번호"
            placeholderTextColor={Colors.placeholderText}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, (!isFormValid || isLoading) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
