import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import "./global.css";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/bg-teal-waves.png")}
      className="flex-1 justify-center items-center bg-cover bg-center"
    >
      <Image
        source={require("../assets/images/logo.jpg")}
        className="rounded-full w-32 h-32"
        resizeMode="contain"
      />

      <View className="mx-auto mt-10 px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8">
        <View className="text-center">
          <Text className="text-4xl font-extrabold tracking-tight text-white text-center sm:text-5xl md:text-6xl">
            Supreme Student Council
          </Text>
          <Text className="text-4xl font-extrabold tracking-tight text-center text-green-500 mt-2">
            Event Attendance Checker
          </Text>

          <Text className="mx-auto mt-3 max-w-xl text-lg text-white sm:mt-5 md:mt-5 text-center">
            Say goodbye to slow roll calls, errors, and proxy
            sign-ins—attendance is now quick, easy, and accurate.
          </Text>

          <View className="mt-5 sm:mt-8 flex justify-center items-center">
            <TouchableOpacity
              onPress={() => router.push("/Login")}
              className="rounded-md bg-green-600 px-8 py-3 md:py-4 md:px-10"
            >
              <Text className="text-white text-base md:text-lg font-medium">
                Get Registered 🚀
              </Text>
            </TouchableOpacity>
             <TouchableOpacity
              onPress={() => router.push("/Attendance")}
              className="rounded-md bg-green-600 px-8 mt-12 py-3 md:py-4 md:px-10"
            >
              <Text className="text-white text-base md:text-lg font-medium">
               Shortcut attendance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/Profile")}
              className="rounded-md bg-green-600 px-8 mt-12 py-3 md:py-4 md:px-10"
            >
              <Text className="text-white text-base md:text-lg font-medium">
               Shortcut Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
