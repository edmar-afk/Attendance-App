import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const FaceAttendance = () => {
  const webviewRef = useRef(null);
  const [showWebView, setShowWebView] = useState(true);

  const sendUserDataToWebView = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData && webviewRef.current) {
      const escapedData = userData.replace(/'/g, "\\'");
      webviewRef.current.injectJavaScript(`
        window.dispatchEvent(new MessageEvent('message', { data: '${escapedData}' }));
        true;
      `);
    }
  };

  useEffect(() => {
    if (showWebView) sendUserDataToWebView();
  }, [showWebView]);

  useFocusEffect(
    useCallback(() => {
      setShowWebView(true);
      return () => {
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
        setShowWebView(false);
      };
    }, [])
  );

  if (!showWebView) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera stopped</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: "https://attendance-checker-frontend.vercel.app/" }}
        onLoadEnd={sendUserDataToWebView}
        startInLoadingState
        renderLoading={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading Attendance...</Text>
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

export default FaceAttendance;
