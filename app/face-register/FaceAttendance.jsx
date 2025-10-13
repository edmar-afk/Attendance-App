import React, { useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FaceAttendance = () => {
  const webviewRef = useRef(null);

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
      />
    </View>
  );
};

export default FaceAttendance;
