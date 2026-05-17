import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StatusBar, Alert, ActivityIndicator, Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PermissionService from '../services/PermissionService';
import { styles, Colors } from '../styles/LocationPicker.styles';

const KAKAO_APP_KEY = '752b26862746e70fa4be2f91d7f79b18';

const createMapHtml = (lat: number, lng: number): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services"></script>
  <script>
    var map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(${lat}, ${lng}),
      level: 3
    });
    var marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(${lat}, ${lng})
    });
    marker.setMap(map);
    map.setDraggable(false);
    map.setZoomable(false);
    var geocoder = new kakao.maps.services.Geocoder();

    function sendLocation(lat, lng) {
      geocoder.coord2RegionCode(lng, lat, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          var r = result[0];
          var province = r.region_1depth_name;
          var isMetro = province.indexOf('특별시') !== -1 || province.indexOf('광역시') !== -1 || province.indexOf('특별자치시') !== -1;
          var raw = isMetro ? province : r.region_2depth_name.split(' ')[0];
          var city = raw.replace(/(특별자치시|특별시|광역시|시|군|구)$/, '');
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'location',
            latitude: lat,
            longitude: lng,
            province: province,
            sido: city,
            dong: r.region_3depth_name
          }));
        }
      });
    }

    function updatePosition(lat, lng) {
      var pos = new kakao.maps.LatLng(lat, lng);
      map.setCenter(pos);
      marker.setPosition(pos);
      sendLocation(lat, lng);
    }

    sendLocation(${lat}, ${lng});
  </script>
</body>
</html>
`;

interface LocationData {
  latitude: number;
  longitude: number;
  province: string;
  sido: string;
  dong: string;
}

interface Props {
  navigation: any;
}

const LocationPickerScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [initialCoords, setInitialCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingGps, setIsLoadingGps] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const granted = await PermissionService.requestLocation();
      if (!granted) {
        Alert.alert('권한 필요', '위치 권한이 필요합니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
        return;
      }

      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      }

      Geolocation.getCurrentPosition(
        pos => {
          if (cancelled) { return; }
          setInitialCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setIsLoadingGps(false);
        },
        () => {
          if (cancelled) { return; }
          Alert.alert('위치 오류', 'GPS 정보를 가져오지 못했습니다.', [
            { text: '확인', onPress: () => navigation.goBack() },
          ]);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      );
    })();

    return () => { cancelled = true; };
  }, [navigation]);

  const handleRefreshLocation = () => {
    if (isRefreshing) { return; }
    setIsRefreshing(true);
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        webViewRef.current?.injectJavaScript(
          `updatePosition(${latitude}, ${longitude}); true;`
        );
        setIsRefreshing(false);
      },
      () => {
        Alert.alert('위치 오류', 'GPS 정보를 가져오지 못했습니다.');
        setIsRefreshing(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleMessage = (event: any) => { // event.nativeEvent is typed as any in react-native-webview
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'location') {
        setLocation(data as LocationData);
      }
    } catch { /* non-JSON 무시 */ }
  };

  const handleConfirm = () => {
    if (!location) { return; }
    navigation.navigate('SignUp', {
      latitude: location.latitude,
      longitude: location.longitude,
      province: location.province,
      sido: location.sido,
      dong: location.dong,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primaryLight} />
      <View style={[styles.statusBar, { height: insets.top }]} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 위치 선택</Text>
      </View>

      {isLoadingGps ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>위치를 가져오는 중...</Text>
        </View>
      ) : (
        <View style={styles.mapWrapper}>
          <WebView
            ref={webViewRef}
            style={styles.map}
            source={{ html: createMapHtml(initialCoords!.latitude, initialCoords!.longitude), baseUrl: 'http://localhost' }}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleMessage}
          />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshLocation}
            disabled={isRefreshing}
            activeOpacity={0.8}
          >
            {isRefreshing
              ? <ActivityIndicator size="small" color={Colors.primary} />
              : <Icon name="my-location" size={22} color={Colors.primary} />}
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.addressText}>
          현재 위치는 {location?.dong ?? '확인 중...'}입니다.
        </Text>
        <Text style={styles.guideText}>위치 갱신 버튼을 눌러 위치를 업데이트하세요.</Text>
        <TouchableOpacity
          style={[styles.confirmButton, !location?.sido && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!location?.sido}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>위치 확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LocationPickerScreenMemo = React.memo(LocationPickerScreen);
LocationPickerScreenMemo.displayName = 'LocationPickerScreen';
export default LocationPickerScreenMemo;
