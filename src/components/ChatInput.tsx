import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/ChatMessge.styles';
import { ChatInputProps } from '../types/PropsTypes';

export const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onChangeText,
  onSend,
  onImageButtonPress,
  selectedImages,
  pickerVisible,
  disabled,
}) => {
  const hasImages = !!selectedImages && selectedImages.length > 0;
  const canSend = (!!inputMessage.trim() || hasImages) && !disabled;

  return (
    <View style={styles.footer}>
<View style={[styles.inputContainer, disabled && { opacity: 0.5 }]}>
        <TouchableOpacity
          style={[
            styles.imageButton,
            (hasImages || pickerVisible) ? { backgroundColor: '#8B5CF6' } : null,
          ]}
          onPress={onImageButtonPress}
          disabled={disabled}
        >
          <Icon
            name="photo-library"
            size={22}
            color={(hasImages || pickerVisible) ? '#FFFFFF' : '#8B5CF6'}
          />
          {hasImages && (
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>{selectedImages!.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {pickerVisible ? (
          <View style={styles.pickerModeInput}>
            <Text style={styles.pickerModeText}>사진</Text>
          </View>
        ) : (
          <TextInput
            value={inputMessage}
            onChangeText={onChangeText}
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
            onSubmitEditing={onSend}
            returnKeyType="send"
            style={styles.textInput}
            editable={!disabled}
          />
        )}

        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: canSend ? '#8B5CF6' : '#E0E0E0' },
          ]}
          onPress={onSend}
          disabled={!canSend}
        >
          <Text style={[
            styles.sendButtonText,
            { color: canSend ? '#FFFFFF' : '#999' },
          ]}>
            전송
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
