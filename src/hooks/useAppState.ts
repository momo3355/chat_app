import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppState = (onForeground: () => void, onBackground?: () => void) => {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        onForeground();
      }
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        onBackground?.();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [onForeground, onBackground]);
};

export default useAppState;
