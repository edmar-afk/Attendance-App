import React, { useRef, useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const FaceAttendance = () => {
  const webviewRef = useRef(null);
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(data);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isFocused && webviewRef.current && userData) {
      const escapedData = userData.replace(/'/g, "\\'");
      webviewRef.current.injectJavaScript(`
        window.dispatchEvent(new MessageEvent('message', { data: '${escapedData}' }));
        true;
      `);
    }
  }, [isFocused, userData]);

  if (!isFocused) return null;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: "https://attendance-checker-frontend.vercel.app/" }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading Attendance...</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FaceAttendance;
