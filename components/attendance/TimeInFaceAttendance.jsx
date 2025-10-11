import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimeInFaceAttendance = () => {
  const webviewRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

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
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <View>
      <TouchableOpacity onPress={openModal}>
        <Text clasName='text-blue-500'>
          Open Face Attendance
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  width: "90%",
                  height: "80%",
                  backgroundColor: "white",
                  borderRadius: 15,
                  overflow: "hidden",
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    padding: 10,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={{ fontSize: 16, color: "red" }}>✕</Text>
                  </TouchableOpacity>
                </View>

                <WebView
                  ref={webviewRef}
                  source={{
                    uri: "https://attendance-checker-frontend.vercel.app/",
                  }}
                  onLoadEnd={sendUserDataToWebView}
                  startInLoadingState
                  renderLoading={() => (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActivityIndicator size="large" color="#0000ff" />
                      <Text>Loading Attendance...</Text>
                    </View>
                  )}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default TimeInFaceAttendance;
