import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { styles, Colors } from '../styles/Settings.styles';
import useFCMStore from '../services/store/FCMStore';
import useLoginStore from '../services/store/LoginStore';
import { claimAdReward } from '../services/api/RewardApi';
import usePointStore from '../services/store/PointStore';

const APP_VERSION = '0.0.1';
const REWARD_AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const LAST_REWARD_KEY = '@last_reward_date';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const pushEnabled = useFCMStore(state => state.pushEnabled);
  const setPushEnabled = useFCMStore(state => state.setPushEnabled);
  const userId = useLoginStore(state => state.user?.userId);
  const fetchPoint = usePointStore(state => state.fetchPoint);
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  const handleRewardAd = useCallback(async () => {
    if (!userId) return;

    const lastDate = await AsyncStorage.getItem(LAST_REWARD_KEY);
    const today = new Date().toDateString();
    if (lastDate === today) {
      Alert.alert('알림', '오늘은 이미 보상을 받으셨습니다.\n내일 다시 시도해주세요.');
      return;
    }

    setIsLoadingAd(true);
    const rewarded = RewardedAd.createForAdRequest(REWARD_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoadingAd(false);
      rewarded.show();
    });

    const unsubEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      const success = await claimAdReward();
      await AsyncStorage.setItem(LAST_REWARD_KEY, today);
      if (success) {
        await fetchPoint();
        Alert.alert('축하합니다!', '30포인트를 받으셨습니다!');
      } else {
        Alert.alert('오류', '포인트 지급에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      unsubLoaded();
      unsubEarned();
    });

    const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      setIsLoadingAd(false);
      Alert.alert('알림', '광고를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
      unsubLoaded();
      unsubEarned();
      unsubError();
    });

    rewarded.load();
  }, [userId]);

  const handleDeleteAccount = () => {
    Alert.alert(
      '탈퇴하기',
      '정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ProfileEditScreen')}
          activeOpacity={0.7}
        >
          <Icon name="person" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>내 프로필</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={() => navigation.navigate('LocationMapScreen', { mode: 'update' })}
          activeOpacity={0.7}
        >
          <Icon name="location-on" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>동네 인증하기</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={() => navigation.navigate('BlockedUsersScreen')}
          activeOpacity={0.7}
        >
          <Icon name="block" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>차단한 회원</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={[styles.menuItem, styles.menuItemBorder]}>
          <Icon name="notifications" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>푸시 알림</Text>
          <Switch
            value={pushEnabled}
            onValueChange={(val) => { if (userId) setPushEnabled(val, userId); }}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('InquiryScreen')}
          activeOpacity={0.7}
        >
          <Icon name="help-outline" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>문의하기</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={() => navigation.navigate('PrivacyPolicyScreen')}
          activeOpacity={0.7}
        >
          <Icon name="privacy-tip" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>개인정보 취급방침</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={() => navigation.navigate('TermsScreen')}
          activeOpacity={0.7}
        >
          <Icon name="description" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>서비스 이용약관</Text>
          <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={[styles.menuItem, styles.menuItemBorder]}>
          <Icon name="info-outline" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>버전 정보</Text>
          <Text style={styles.versionText}>{APP_VERSION}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleRewardAd}
          disabled={isLoadingAd}
          activeOpacity={0.7}
        >
          <Icon name="card-giftcard" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={styles.menuText}>광고로 보상받기</Text>
          {isLoadingAd
            ? <ActivityIndicator size="small" color={Colors.primary} />
            : <Text style={styles.rewardText}>+30P</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Icon name="exit-to-app" size={22} color={Colors.textSecondary} style={styles.menuIcon} />
          <Text style={[styles.menuText, styles.deleteText]}>탈퇴하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const SettingsScreenMemo = React.memo(SettingsScreen);
SettingsScreenMemo.displayName = 'SettingsScreen';
export default SettingsScreenMemo;
