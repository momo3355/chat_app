import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { styles, Colors } from '../styles/Settings.styles';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ProfileEditScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>내 프로필</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#E0E0E0' }]}
          onPress={() => navigation.navigate('LocationMapScreen', { mode: 'update' })}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>동네 인증하기</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SettingsScreenMemo = React.memo(SettingsScreen);
SettingsScreenMemo.displayName = 'SettingsScreen';
export default SettingsScreenMemo;
