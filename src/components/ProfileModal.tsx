import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { homeStyles as styles } from '../styles/Home.styles';
import { getProfileUrl } from '../utils/Utils';
import { UserSearchItem } from '../types/UserInfoTypes';

interface Props {
  user: UserSearchItem | null;
  onClose: () => void;
  onCreateRoom: () => void;
}

const ProfileModal = React.memo(({ user, onClose, onCreateRoom }: Props) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [imgRatio, setImgRatio] = useState<number | null>(null);

  useEffect(() => {
    setImgFailed(false);
    setImgRatio(null);
  }, [user?.userId]);

  const accentColor = user?.gender === 'W' ? '#db2777' : '#3DBFA8';

  return (
    <Modal visible={user !== null} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.profileModalBox} activeOpacity={1}>
          <View style={styles.profileImageSection}>
            {!imgFailed && user ? (
              <Image
                source={{ uri: getProfileUrl(user.userId) }}
                style={[
                  styles.profileModalImage,
                  imgRatio ? { aspectRatio: imgRatio } : { height: 240 },
                ]}
                onLoad={e => {
                  const { width, height } = e.nativeEvent.source;
                  if (width && height) setImgRatio(width / height);
                }}
                onError={() => setImgFailed(true)}
              />
            ) : (
              <View style={styles.profileModalDefault}>
                <Icon name="person" size={64} color={accentColor} />
              </View>
            )}
          </View>
          {user && (
            <>
              <View style={styles.profileInfoSection}>
                <View style={styles.profileInfoRow}>
                  <Text style={styles.profileInfoLabel}>이름</Text>
                  <Text style={[styles.profileInfoValue, { color: accentColor }]}>{user.userName}</Text>
                </View>
                <View style={styles.profileInfoRow}>
                  <Text style={styles.profileInfoLabel}>나이</Text>
                  <Text style={styles.profileInfoValue}>{user.age}세</Text>
                </View>
                <View style={styles.profileInfoRow}>
                  <Text style={styles.profileInfoLabel}>지역</Text>
                  <Text style={styles.profileInfoValue}>{user.sido ?? '-'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.createRoomBtn} onPress={onCreateRoom}>
                <Text style={styles.createRoomBtnText}>채팅방 만들기</Text>
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

ProfileModal.displayName = 'ProfileModal';

export default ProfileModal;
