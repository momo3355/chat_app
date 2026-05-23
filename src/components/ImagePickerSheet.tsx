import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View, FlatList, Image, TouchableOpacity, Text,
  Animated, Dimensions, ActivityIndicator, Alert, Linking,
  Platform, PermissionsAndroid, StyleSheet, PanResponder, LayoutAnimation,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

interface ImagePickerSheetProps {
  heightAnim: Animated.Value;
  isVisible: boolean;
  selectedUris: string[];
  onSelectionChange: (uris: string[]) => void;
  onClose: () => void;
  maxSelection?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const PAGE_SIZE = 60;

const getPhotoSize = (cols: number) => Math.floor((SCREEN_WIDTH - (cols + 1) * 2) / cols);

const getDistance = (touches: { pageX: number; pageY: number }[]) => {
  const dx = touches[0].pageX - touches[1].pageX;
  const dy = touches[0].pageY - touches[1].pageY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const ImagePickerSheet: React.FC<ImagePickerSheetProps> = ({
  heightAnim,
  isVisible,
  selectedUris,
  onSelectionChange,
  onClose,
  maxSelection = 4,
}) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [columns, setColumns] = useState(3);

  const columnsRef = useRef(3);
  const pinchInitDist = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      // 두 손가락 감지 시에만 PanResponder가 제스처를 가져감
      onStartShouldSetPanResponder: evt => evt.nativeEvent.touches.length >= 2,
      onMoveShouldSetPanResponder: evt => evt.nativeEvent.touches.length >= 2,

      onPanResponderGrant: evt => {
        if (evt.nativeEvent.touches.length >= 2) {
          pinchInitDist.current = getDistance(evt.nativeEvent.touches as any);
        }
      },

      onPanResponderMove: evt => {
        if (evt.nativeEvent.touches.length < 2 || pinchInitDist.current === null) { return; }
        const dist = getDistance(evt.nativeEvent.touches as any);
        const ratio = dist / pinchInitDist.current;

        if (ratio > 1.25 && columnsRef.current > 1) {
          // 벌리기 → 열 줄임 (확대)
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          columnsRef.current -= 1;
          setColumns(columnsRef.current);
          pinchInitDist.current = dist;
        } else if (ratio < 0.78 && columnsRef.current < 3) {
          // 오므리기 → 열 늘림 (축소)
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          columnsRef.current += 1;
          setColumns(columnsRef.current);
          pinchInitDist.current = dist;
        }
      },

      onPanResponderRelease: () => {
        pinchInitDist.current = null;
      },
    })
  ).current;

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') { return true; }
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const already = await PermissionsAndroid.check(permission);
    if (already) { return true; }

    const result = await PermissionsAndroid.request(permission);
    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        '갤러리 권한 필요',
        '갤러리 접근 권한이 거부되었습니다.\n설정에서 권한을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정으로 이동', onPress: () => Linking.openSettings() },
        ],
      );
    }
    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const loadPhotos = useCallback(async (after?: string) => {
    const isInitial = !after;
    if (isInitial) { setLoading(true); } else { setLoadingMore(true); }
    try {
      const granted = await requestPermission();
      if (!granted) { setPermissionDenied(true); return; }
      const result = await CameraRoll.getPhotos({ first: PAGE_SIZE, assetType: 'Photos', after });
      const newUris = result.edges.map(e => e.node.image.uri);
      if (isInitial) {
        setPhotos(newUris);
      } else {
        setPhotos(prev => [...prev, ...newUris]);
      }
      setHasMore(result.page_info.has_next_page);
      setCursor(result.page_info.end_cursor);
    } catch {
      setPermissionDenied(true);
    } finally {
      if (isInitial) { setLoading(false); } else { setLoadingMore(false); }
    }
  }, []);

  useEffect(() => {
    if (isVisible && photos.length === 0 && !loading && !permissionDenied) {
      loadPhotos();
    }
  }, [isVisible, photos.length, loading, loadPhotos, permissionDenied]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading && cursor) {
      loadPhotos(cursor);
    }
  }, [hasMore, loadingMore, loading, cursor, loadPhotos]);

  const toggleSelection = useCallback((uri: string) => {
    if (selectedUris.includes(uri)) {
      onSelectionChange(selectedUris.filter(u => u !== uri));
    } else {
      if (selectedUris.length >= maxSelection) {
        Alert.alert('선택 제한', `사진은 최대 ${maxSelection}장까지 선택할 수 있습니다.`);
        return;
      }
      onSelectionChange([...selectedUris, uri]);
    }
  }, [selectedUris, onSelectionChange, maxSelection]);

  const renderItem = useCallback(({ item }: { item: string }) => {
    const size = getPhotoSize(columns);
    const selectionIndex = selectedUris.indexOf(item);
    const isSelected = selectionIndex !== -1;
    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item)}
        style={{ width: size, height: size, margin: 1 }}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item }} style={{ width: size, height: size }} resizeMode="cover" />
        {isSelected && (
          <View style={[StyleSheet.absoluteFill, sheetStyles.selectedOverlay]}>
            <View style={sheetStyles.selectionBadge}>
              <Text style={sheetStyles.selectionBadgeText}>{selectionIndex + 1}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [selectedUris, toggleSelection, columns]);

  return (
    <Animated.View style={[sheetStyles.container, { height: heightAnim }]}>
      <View style={sheetStyles.handleBar} />

      <View style={sheetStyles.header}>
        <Text style={sheetStyles.headerTitle}>
          {selectedUris.length > 0 ? `${selectedUris.length} / ${maxSelection}장 선택됨` : `사진 선택 (최대 ${maxSelection}장)`}
        </Text>
        {/* 현재 열 수 표시 (줌 레벨) */}
        <View style={sheetStyles.zoomIndicator}>
          {[1, 2, 3].map(n => (
            <View
              key={n}
              style={[sheetStyles.zoomDot, columns === n && sheetStyles.zoomDotActive]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={onClose} style={sheetStyles.closeButton}>
          <Text style={sheetStyles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={sheetStyles.loader} />
      ) : permissionDenied ? (
        <View style={sheetStyles.emptyState}>
          <Text style={sheetStyles.emptyText}>
            갤러리 접근 권한이 필요합니다.{'\n'}설정에서 권한을 허용해주세요.
          </Text>
        </View>
      ) : (
        // panResponder 영역: 2손가락 핀치는 여기서 처리, 1손가락 스크롤은 FlatList로 전달
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
          <FlatList
            key={columns}
            data={photos}
            numColumns={columns}
            keyExtractor={(_, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            extraData={[selectedUris, columns]}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore
                ? <ActivityIndicator color="#8B5CF6" style={{ paddingVertical: 16 }} />
                : null
            }
          />
        </View>
      )}
    </Animated.View>
  );
};

const sheetStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1C4E9',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  zoomIndicator: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  zoomDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  zoomDotActive: {
    backgroundColor: '#8B5CF6',
    width: 9,
    height: 9,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  selectedOverlay: {
    backgroundColor: 'rgba(139, 92, 246, 0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 5,
  },
  selectionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
