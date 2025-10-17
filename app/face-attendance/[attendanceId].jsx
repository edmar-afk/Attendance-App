import React, { useRef, useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

const FaceAttendance = () => {
  const { attendanceId } = useLocalSearchParams();
  const webviewRef = useRef(null);
  const [showWebView, setShowWebView] = useState(true);

  const sendUserDataToWebView = async () => {
    try {
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
    } catch (error) {
      console.error("Error sending userData to WebView:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setShowWebView(true);
      sendUserDataToWebView();

      const intervalId = setInterval(() => {
        sendUserDataToWebView();
      }, 2000);

      return () => {
        clearInterval(intervalId);
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
    }, [attendanceId])
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
