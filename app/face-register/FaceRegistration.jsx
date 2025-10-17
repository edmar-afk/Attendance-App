import React, { useRef, useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

const FaceRegistration = () => {
  const { attendanceoutId } = useLocalSearchParams();
  const webviewRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  const sendUserDataToWebView = useCallback(() => {
    if (userData && webviewRef.current) {
      const payload = { user: userData, attendanceoutId };
      webviewRef.current.injectJavaScript(`
        (function() {
          window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(payload)} }));
        })();
        true;
      `);
    }
  }, [userData, attendanceoutId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem("userData");
          if (storedUserData && isActive) {
            setUserData(JSON.parse(storedUserData));
            setShowWebView(true);
          }
        } catch (error) {
          console.error("Failed to load userData:", error);
        }
      };

      fetchUserData();

      return () => {
        isActive = false;
        setShowWebView(false);
        if (webviewRef.current) {
          webviewRef.current.injectJavaScript(`
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
              if(v.srcObject){
                v.srcObject.getTracks().forEach(track => track.stop());
              }
            });
            true;
          `);
        }
      };
    }, [])
  );

  if (!showWebView) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Face Attendance...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Text>{userData?.id}</Text>
      <WebView
        ref={webviewRef}
        source={{ uri: `https://attendance-checker-frontend.vercel.app/` }}
        onLoadEnd={() => setTimeout(sendUserDataToWebView, 500)}
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

export default FaceRegistration;
