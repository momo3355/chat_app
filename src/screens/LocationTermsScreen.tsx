import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, Colors } from '../styles/LocationTerms.styles';

interface Props {
  navigation: any;
}

const TERMS = [
  {
    id: 'collect',
    title: '위치정보 수집·이용 동의 (필수)',
    content: '수집 항목: GPS 기반 현재 위치정보\n이용 목적: 동네 인증 및 지역 기반 서비스 제공\n보유 기간: 서비스 이용 기간 및 관련 법령에 따른 보존 기간',
  },
  {
    id: 'third',
    title: '위치정보 제3자 제공 동의 (필수)',
    content: '제공 대상: 서비스 운영사\n제공 항목: 법정동 단위 주소 정보\n이용 목적: 지역 기반 사용자 매칭 서비스 제공\n보유 기간: 서비스 이용 기간',
  },
];

const LocationTermsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    collect: false,
    third: false,
  });

  const allChecked = Object.values(checked).every(Boolean);

  const toggleAll = () => {
    const next = !allChecked;
    setChecked({ collect: next, third: next });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primaryLight} />
      <View style={[styles.statusBar, { height: insets.top }]} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>위치 서비스 이용약관</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.allAgreeRow} onPress={toggleAll} activeOpacity={0.8}>
          <Icon
            name={allChecked ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={allChecked ? Colors.primary : Colors.border}
          />
          <Text style={styles.allAgreeText}>전체 동의</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {TERMS.map(term => (
          <View key={term.id} style={styles.termBlock}>
            <TouchableOpacity
              style={styles.termTitleRow}
              onPress={() => setChecked(prev => ({ ...prev, [term.id]: !prev[term.id] }))}
              activeOpacity={0.8}
            >
              <Icon
                name={checked[term.id] ? 'check-circle' : 'radio-button-unchecked'}
                size={20}
                color={checked[term.id] ? Colors.primary : Colors.border}
              />
              <Text style={styles.termTitle}>{term.title}</Text>
            </TouchableOpacity>
            <View style={styles.termContent}>
              <Text style={styles.termContentText}>{term.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.nextButton, !allChecked && styles.nextButtonDisabled]}
          onPress={() => navigation.navigate('LocationPicker')}
          disabled={!allChecked}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LocationTermsScreenMemo = React.memo(LocationTermsScreen);
LocationTermsScreenMemo.displayName = 'LocationTermsScreen';
export default LocationTermsScreenMemo;
