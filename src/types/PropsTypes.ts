import { MessgeInfoValue } from './MessgeTypes';

export interface ChatInputProps {
  inputMessage: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImageButtonPress: () => void;
  selectedImages?: string[];
  pickerVisible?: boolean;
  disabled?: boolean;
  isUploading?: boolean;
}

export interface ChatMessageProps {
  item: MessgeInfoValue;
  isMyMessage: boolean;
}

export interface ChatHeaderProps {
  title: string;
  isConnected: boolean;
  onBack: () => void;
  onLeave: () => void;
}
