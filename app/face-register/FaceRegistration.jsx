import React, { useRef, useState, useCallback, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

const FaceRegistration = () => {
  const webviewRef = useRef(null);
  const [showWebView, setShowWebView] = useState(false);

  const { userId } = useLocalSearchParams();
  console.log("User ID from Header:", userId);

  const sendUserIdToWebView = useCallback(() => {
    if (!userId || !webviewRef.current) return;

    webviewRef.current.injectJavaScript(`
      (function() {
        window.dispatchEvent(new MessageEvent('message', { data: ${userId} }));
      })();
      true;
    `);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const interval = setInterval(sendUserIdToWebView, 500);
      return () => clearInterval(interval);
    }
  }, [userId, sendUserIdToWebView]);

  useFocusEffect(
    useCallback(() => {
      setShowWebView(true);

      return () => {
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
      {/* <Text>User ID: {userId}</Text> */}
      <WebView
        ref={webviewRef}
        source={{ uri: `https://attendance-checker-frontend.vercel.app/` }}
        onLoadEnd={() => setTimeout(sendUserIdToWebView, 500)}
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
