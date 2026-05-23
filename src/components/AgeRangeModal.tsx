import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { filterBarStyles as styles } from '../styles/FilterBar.styles';
import { AGES } from '../utils/Utils';

const AGE_ITEM_HEIGHT = 44;

interface Props {
  visible: boolean;
  tempAgeFrom: number;
  tempAgeTo: number;
  setTempAgeFrom: (v: number) => void;
  setTempAgeTo: (v: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  onReset?: () => void;
  ages?: number[];
}

const AgeRangeModal = React.memo(({
  visible, tempAgeFrom, tempAgeTo, setTempAgeFrom, setTempAgeTo, onConfirm, onClose, onReset, ages = AGES,
}: Props) => {
  const fromIndex = Math.max(0, ages.indexOf(tempAgeFrom));
  const toIndex = Math.max(0, ages.indexOf(tempAgeTo));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.ageModalBox} activeOpacity={1}>
          <Text style={styles.modalTitle}>나이 선택</Text>
          <View style={styles.agePickerRow}>
            <FlatList
              data={ages}
              keyExtractor={item => `from-${item}`}
              style={styles.agePicker}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({ length: AGE_ITEM_HEIGHT, offset: AGE_ITEM_HEIGHT * index, index })}
              initialScrollIndex={fromIndex}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.ageItem, tempAgeFrom === item && styles.ageItemSelected]}
                  onPress={() => setTempAgeFrom(item)}
                >
                  <Text style={[styles.ageItemText, tempAgeFrom === item && styles.ageItemTextSelected]}>
                    {item}세
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Text style={styles.ageSeparator}>~</Text>
            <FlatList
              data={ages}
              keyExtractor={item => `to-${item}`}
              style={styles.agePicker}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({ length: AGE_ITEM_HEIGHT, offset: AGE_ITEM_HEIGHT * index, index })}
              initialScrollIndex={toIndex}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.ageItem, tempAgeTo === item && styles.ageItemSelected]}
                  onPress={() => setTempAgeTo(item)}
                >
                  <Text style={[styles.ageItemText, tempAgeTo === item && styles.ageItemTextSelected]}>
                    {item}세
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.ageBtnRow}>
            {onReset && (
              <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
                <Text style={styles.resetBtnText}>전체</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

AgeRangeModal.displayName = 'AgeRangeModal';

export default AgeRangeModal;
