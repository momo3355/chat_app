import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const REPORT_REASONS = [
  '스팸/광고',
  '욕설/비방',
  '음란물/불쾌한 내용',
  '사기/피싱',
  '개인정보 침해',
  '기타',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

const ReportModal = React.memo(({ visible, onClose, onSubmit }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) { return; }
    setIsLoading(true);
    await onSubmit(selected);
    setIsLoading(false);
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={reportStyles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity style={reportStyles.sheet} activeOpacity={1}>
          <Text style={reportStyles.title}>신고하기</Text>
          <Text style={reportStyles.subtitle}>신고 사유를 선택해 주세요</Text>

          <View style={reportStyles.reasonList}>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={reportStyles.reasonItem}
                onPress={() => setSelected(reason)}
              >
                <View style={[reportStyles.radio, selected === reason && reportStyles.radioSelected]}>
                  {selected === reason && <View style={reportStyles.radioDot} />}
                </View>
                <Text style={[reportStyles.reasonText, selected === reason && reportStyles.reasonTextSelected]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={reportStyles.btnRow}>
            <TouchableOpacity style={reportStyles.cancelBtn} onPress={handleClose}>
              <Text style={reportStyles.cancelBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[reportStyles.submitBtn, !selected && reportStyles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!selected || isLoading}
            >
              {isLoading
                ? <ActivityIndicator size="small" color="#FFFFFF" />
                : <Text style={reportStyles.submitBtnText}>신고하기</Text>
              }
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

ReportModal.displayName = 'ReportModal';
export default ReportModal;

const reportStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
  },
  reasonList: {
    marginBottom: 24,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#8B5CF6',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  reasonText: {
    fontSize: 15,
    color: '#374151',
  },
  reasonTextSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#C4B5FD',
  },
  submitBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
