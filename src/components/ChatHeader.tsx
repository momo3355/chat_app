/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/ChatMessge.styles';
import { ChatHeaderProps } from '../types/PropsTypes';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  isConnected,
  onBack,
  onLeave,
  onReport,
  onBlock,
  onFavorite,
  isFavorite,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleAction = (action?: () => void) => {
    setMenuVisible(false);
    action?.();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer} pointerEvents="none">
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8, marginLeft: 'auto' }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: isConnected ? '#4CAF50' : '#FF5252',
            marginRight: 8,
          }}
        />
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 4 }}>
          <Icon name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLeave} style={{ padding: 4, marginLeft: 4 }}>
          <Icon name="exit-to-app" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={dropdownStyles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={dropdownStyles.menu}>
                <TouchableOpacity
                  style={dropdownStyles.item}
                  onPress={() => handleAction(onReport)}
                >
                  <Icon name="flag" size={18} color="#EF4444" />
                  <Text style={[dropdownStyles.itemText, { color: '#EF4444' }]}>신고하기</Text>
                </TouchableOpacity>
                <View style={dropdownStyles.divider} />
                <TouchableOpacity
                  style={dropdownStyles.item}
                  onPress={() => handleAction(onBlock)}
                >
                  <Icon name="block" size={18} color="#374151" />
                  <Text style={dropdownStyles.itemText}>차단하기</Text>
                </TouchableOpacity>
                <View style={dropdownStyles.divider} />
                <TouchableOpacity
                  style={dropdownStyles.item}
                  onPress={() => handleAction(onFavorite)}
                >
                  <Icon
                    name={isFavorite ? 'star' : 'star-border'}
                    size={18}
                    color="#F59E0B"
                  />
                  <Text style={dropdownStyles.itemText}>즐겨찾기</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 56,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 150,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 8,
  },
});
