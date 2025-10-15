import React, { useRef } from "react";
import { View, Animated } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

export default function Logout() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        router.replace("/Login");
      }, 3000);

      return () => clearTimeout(timeout);
    }, [])
  );

  return (
    <View className="flex-1 justify-center items-center bg-red-500">
      <Animated.Text
        className="text-white font-bold"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          fontSize: 24,
        }}
      >
        Logging out...
      </Animated.Text>
    </View>
  );
}
