import React, { useRef, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const FaceOutAttendance = () => {
  const { attendanceoutId } = useLocalSearchParams();
  const webviewRef = useRef(null);

  const sendUserDataToWebView = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData && webviewRef.current) {
      const payload = {
        user: JSON.parse(userData),
        attendanceoutId,
      };
      const escapedData = JSON.stringify(payload).replace(/'/g, "\\'");
      webviewRef.current.injectJavaScript(`
        window.dispatchEvent(new MessageEvent('message', { data: '${escapedData}' }));
        true;
      `);
    }
  };

  useEffect(() => {
    sendUserDataToWebView();
  }, []);

  return (
    <View className="flex-1">
      <WebView
        ref={webviewRef}
        source={{
          uri: `https://attendance-checker-frontend.vercel.app/face-recognitionOut/`,
        }}
        onLoadEnd={sendUserDataToWebView}
        startInLoadingState
        renderLoading={() => (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading Face Attendance...</Text>
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        allowsProtectedMedia
        allowsCameraAccess
        originWhitelist={["*"]}
      />
    </View>
  );
};

export default FaceOutAttendance;
