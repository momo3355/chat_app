/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getWebSocketUrl } from '../utils/Utils';
import { MessgeInfoValue } from '../types/MessgeTypes';
import { UseChatWebSocketTypes} from '../types/UseChatWebSocketTypes'


const useChatWebSocket = ({ userId, userName, roomId, token }: UseChatWebSocketTypes) => {
  const [messages, setMessages] = useState<MessgeInfoValue[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // WebSocket 연결
  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(getWebSocketUrl()),
      connectHeaders: {
        'chatType': 'room',
        'userId': userId,
        'roomId': roomId,
        'token' : token,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 25000,
      heartbeatOutgoing: 25000,
      debug: (str) => {
        console.log('STOMP debug:', str);
      },
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        setIsConnected(true);

        // 채팅방 구독
        client.subscribe(`/sub/chat/room/${roomId}`, (message: IMessage) => {
          const received = JSON.parse(message.body);
          console.log(received);
          if (received.type === 'ENTER') {
            const enteredUser = received.sender;
            // 내 자신의 ENTER는 스킵: ChatStore.loadMessgeInfoPosts에서 reUserId 기준으로 이미 차감 처리함
            // 여기서 다시 처리하면 isRead가 이중 차감되어 화면에서 값이 바뀌는 게 보임
            if (enteredUser === userId) { return; }
            // 다른 사용자 입장: 해당 유저가 읽지 않은 메시지의 isRead에서 1 차감
            // userList: WebSocket 수신 메시지, reUserId: DB 로드 메시지
            setMessages(prev => prev.map(msg => {
              const inUserList = msg.userList?.includes(enteredUser);
              const inReUserId = msg.reUserId === enteredUser;
              if (!inUserList && !inReUserId) {
                return msg;
              }
              const newUserList = (msg.userList || []).filter((u: string) => u !== enteredUser);
              const newIsRead = Math.max(0, (parseInt(msg.isRead || '0', 10) - 1));
              return { ...msg, userList: newUserList, reUserId: '', isRead: String(newIsRead) };
            }));
            return;
          }
          setMessages(prev => [received, ...prev]);
        });

        // 채팅방 입장 메시지 전송
        const enterMessage = {
          roomId,
          sender: userId,
          userName: userName,
          type: 'ENTER',          
        };
        client.publish({
          destination: '/pub/chat/enter',
          body: JSON.stringify(enterMessage),
        });
        console.log('채팅방 입장 메시지 전송 완료');
      },
      onDisconnect: () => {
        console.log('WebSocket 연결 해제');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류:', frame.headers['message']);
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [roomId, userId]);

  // 메시지 전송
  const sendMessage = useCallback((type: string, message: string, imageInfo?: string) => {
    if (type !== 'IMAGE' && !message.trim()) { return; }
    const messageToSend = {
        id: userId,
        sender: userId,
        message,
        userName: userName,
        roomId,
        type,
        isRead: '0',
        reUserId: '',
        userList: [],
        ...(imageInfo && { imageInfo }),
    };

    const publish = () => {
      clientRef.current?.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify(messageToSend),
      });
    };

    if (clientRef.current?.connected) {
      publish();
    } else {
      // 소켓 재연결 대기 후 전송 (최대 10초)
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (clientRef.current?.connected) {
          clearInterval(interval);
          publish();
        } else if (Date.now() - startTime > 10000) {
          clearInterval(interval);
          console.warn('⚠️ [sendMessage] 소켓 재연결 대기 시간 초과, 메시지 전송 실패');
        }
      }, 300);
    }
  }, [roomId, userId, userName]);

  // 펜딩 메시지 병합 (백그라운드 FCM 메시지)
  const mergePendingMessages = useCallback((pendingMessages: MessgeInfoValue[]) => {
    if (pendingMessages.length === 0) return;
    setMessages(prev => {
      // 중복 방지: cretDate + sender + message 조합으로 비교
      const existingKeys = new Set(prev.map(m => `${m.cretDate}_${m.sender}_${m.message}`));
      const newMessages = pendingMessages.filter(
        m => !existingKeys.has(`${m.cretDate}_${m.sender}_${m.message}`)
      );
      return [...newMessages, ...prev];
    });
  }, []);

  // 이전 메시지 추가 (페이지네이션 - 배열 끝에 붙여 화면 상단에 표시)
  const appendOlderMessages = useCallback((olderMessages: MessgeInfoValue[]) => {
    if (olderMessages.length === 0) return;
    setMessages(prev => {
      const existingKeys = new Set(prev.map(m => `${m.cretDate}_${m.sender}_${m.message}`));
      const newMessages = olderMessages.filter(
        m => !existingKeys.has(`${m.cretDate}_${m.sender}_${m.message}`)
      );
      return [...prev, ...newMessages];
    });
  }, []);

  // 연결 해제
  const disconnect = useCallback(() => {
    if (clientRef.current?.connected) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // 마운트 시 연결, 언마운트 시 해제
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    messages,
    isConnected,
    sendMessage,
    disconnect,
    reconnect: connect,
    mergePendingMessages,
    appendOlderMessages,
  };
};

export default useChatWebSocket;
