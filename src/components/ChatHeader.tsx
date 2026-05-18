/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/ChatMessge.styles';
import { ChatHeaderProps } from '../types/PropsTypes';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  isConnected,
  onBack,
  onLeave,
}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow-back" size={24} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: isConnected ? '#4CAF50' : '#FF5252',
          marginRight: 12,
        }}
      />
      <TouchableOpacity onPress={onLeave} style={{ padding: 4 }}>
        <Icon name="exit-to-app" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </View>
);
