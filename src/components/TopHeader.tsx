import React, { useEffect, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { topHeaderStyles as styles } from '../styles/TopHeader.styles';
import usePointStore from '../services/store/PointStore';

interface Props {
  label: string;
  actionSlot?: ReactNode;
}

const TopHeader: React.FC<Props> = ({ label, actionSlot }) => {
  const insets = useSafeAreaInsets();
  const point = usePointStore(state => state.point);
  const fetchPoint = usePointStore(state => state.fetchPoint);

  useEffect(() => {
    fetchPoint();
  }, [fetchPoint]);

  return (
    <View style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={['#6d28d9', '#9333ea', '#c026d3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <Text style={styles.labelText}>{label}</Text>
        <View style={styles.rightRow}>
          {actionSlot}
          <View style={styles.pointRow}>
            <Icon name="stars" size={15} color="#fde68a" />
            <Text style={styles.pointText}>{point.toLocaleString()} P</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default React.memo(TopHeader);
