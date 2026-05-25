import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles, viewerStyles } from '../styles/ChatMessge.styles';
import { ChatMessageProps } from '../types/PropsTypes';
import { formatTime, getThumbnailUrl, getOriginalUrl, getProfileUrl } from '../utils/Utils';

const IMAGE_MAX_WIDTH_LIMIT = 230;
// paddingHorizontal: 12 × 2
const CONTENT_PADDING = 24;
// profileImage(45) + marginRight(8)
const PROFILE_SPACE = 53;
// messageInfo minWidth(62) + margins(~8)
const TIME_SPACE = 70;

// 모듈 레벨 캐시: 컴포넌트 언마운트/리마운트 후에도 유지
const imageSizeCache = new Map<string, { width: number; height: number }>();

const ImageMessage: React.FC<{ imageInfo?: string; sender?: string; maxWidth: number }> = ({ imageInfo, sender, maxWidth }) => {
  const thumbnailUrl = getThumbnailUrl(imageInfo, sender);
  const originalUrl = getOriginalUrl(imageInfo);
  const cacheKey = `${thumbnailUrl}_${maxWidth}`;
  const [viewerVisible, setViewerVisible] = useState(false);

  const [imgSize, setImgSize] = useState<{ width: number; height: number }>(() => {
    return imageSizeCache.get(cacheKey) ?? { width: maxWidth, height: maxWidth * 3 / 4 };
  });

  useEffect(() => {
    if (!thumbnailUrl) { return; }
    const cached = imageSizeCache.get(cacheKey);
    if (cached) {
      setImgSize(cached);
      return;
    }
    Image.getSize(
      thumbnailUrl,
      (naturalWidth, naturalHeight) => {
        const displayHeight = (naturalHeight / naturalWidth) * maxWidth;
        const size = { width: maxWidth, height: displayHeight };
        imageSizeCache.set(cacheKey, size);
        setImgSize(size);
      },
      () => {
        const fallback = { width: maxWidth, height: maxWidth * 3 / 4 };
        imageSizeCache.set(cacheKey, fallback);
        setImgSize(fallback);
      },
    );
  }, [thumbnailUrl, cacheKey, maxWidth]);

  return (
    <>
      <TouchableOpacity onPress={() => setViewerVisible(true)} activeOpacity={0.9}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={[styles.imageThumbnail, { width: imgSize.width, height: imgSize.height }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Modal visible={viewerVisible} transparent animationType="fade" onRequestClose={() => setViewerVisible(false)}>
        <View style={viewerStyles.overlay}>
          <TouchableOpacity style={viewerStyles.closeBtn} onPress={() => setViewerVisible(false)}>
            <Icon name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={viewerStyles.imageArea} activeOpacity={1} onPress={() => setViewerVisible(false)}>
            <Image
              source={{ uri: originalUrl }}
              style={viewerStyles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ item, isMyMessage }) => {
  const { width: screenWidth } = useWindowDimensions();

  if (item.type === 'QUIT') {
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>상대방이 대화방에서 나갔습니다.</Text>
      </View>
    );
  }

  const isImage = item.type === 'IMAGE';

  const imageMaxWidth = Math.min(
    IMAGE_MAX_WIDTH_LIMIT,
    isMyMessage
      ? screenWidth - CONTENT_PADDING - TIME_SPACE
      : screenWidth - CONTENT_PADDING - PROFILE_SPACE - TIME_SPACE,
  );

  if (isMyMessage) {
    return (
      <View style={styles.messageRow}>
        <View style={styles.messageInfoMine}>
          {item.isRead !== undefined && String(item.isRead) !== '0' && (
            <Text style={styles.readCount}>{item.isRead}</Text>
          )}
          <Text style={styles.messageTimeMine}>{formatTime(item.cretDate)}</Text>
        </View>
        {isImage ? (
          <ImageMessage imageInfo={item.imageInfo} sender={item.sender} maxWidth={imageMaxWidth} />
        ) : (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      </View>
    );
  }
  return (
    <View style={styles.messageRowOther}>
      <Image
        source={{ uri: getProfileUrl(item.sender) }}
        style={styles.profileImage}
        resizeMode="cover"
      />
      {isImage ? (
        <ImageMessage imageInfo={item.imageInfo} sender={item.sender} maxWidth={imageMaxWidth} />
      ) : (
        <View style={styles.messageBubbleOther}>
          <Text style={styles.messageTextOther}>{item.message}</Text>
        </View>
      )}
      <View style={styles.messageInfo}>
        {item.isRead !== undefined && String(item.isRead) !== '0' && (
          <Text style={styles.readCount}>{item.isRead}</Text>
        )}
        <Text style={styles.messageTime}>{formatTime(item.cretDate)}</Text>
      </View>
    </View>
  );
};
