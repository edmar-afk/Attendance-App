import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

const FaceAttendance = () => {
  const { attendanceId } = useLocalSearchParams();
  const webviewRef = useRef(null);
  const [showWebView, setShowWebView] = useState(true);

  const sendUserDataToWebView = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData && webviewRef.current) {
      const payload = {
        user: JSON.parse(userData),
        attendanceId,
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

  // 👇 Stop WebView when navigating away
  useFocusEffect(
    useCallback(() => {
      setShowWebView(true);
      return () => {
        setShowWebView(false);
      };
    }, [])
  );

  return (
    <View className="flex-1">
      {showWebView ? (
        <WebView
          ref={webviewRef}
          source={{
            uri: `https://attendance-checker-frontend.vercel.app/face-recognition/`,
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
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>Camera stopped</Text>
        </View>
      )}
    </View>
  );
};

export default FaceAttendance;
