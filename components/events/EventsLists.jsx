import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditEvent from "./EditEvent";
import api from "../../assets/api";

const EventsLists = ({
  eventId,
  eventName,
  description,
  dateStarted,
  onEventDeleted,
  isSuperuser, // receive the prop
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const openEditModal = () => setEditModalVisible(true);
  const closeEditModal = () => setEditModalVisible(false);

  const handleDelete = () => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/events/delete/${eventId}/`);
            Alert.alert("Success", "Event deleted successfully.");
            if (onEventDeleted) onEventDeleted(eventId);
          } catch (error) {
            Alert.alert("Error", "Failed to delete the event.");
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <View className="p-2">
      <View className="w-full mx-auto bg-green-800 rounded-lg shadow-lg">
        <View className="px-6 py-5">
          <View className="flex-row items-start">
            <Ionicons name="bookmark-sharp" size={30} color="white" />

            <View className="flex-1 ml-4">
              <Text className="text-2xl font-extrabold text-gray-50 truncate mb-2">
                {eventName}
              </Text>

              <View className="flex-row items-center space-x-3 mb-4">
                <Ionicons name="calendar" size={16} color="white" />
                <Text className="text-green-50 text-sm ml-2">
                  Event Started on{" "}
                  {new Date(dateStarted).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <Text className="text-green-100 mb-2">{description}</Text>

              {/* <Text className="text-white text-xs italic absolute -bottom-8">
                Be there on time to avoid fines
              </Text> */}

              {isSuperuser && ( // only show if superuser
                <View className="flex-row gap-3 justify-end space-x-4">
                  <View className="items-center">
                    <TouchableOpacity
                      className="w-10 h-10 rounded-full bg-green-500 justify-center items-center"
                      onPress={openEditModal}
                    >
                      <Ionicons name="create-outline" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xs font-bold text-white mt-1">
                      Edit
                    </Text>
                  </View>

                  <View className="items-center">
                    <TouchableOpacity
                      className="w-10 h-10 rounded-full bg-red-500 justify-center items-center"
                      onPress={handleDelete}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FCA5A5"
                      />
                    </TouchableOpacity>
                    <Text className="text-xs font-bold text-white mt-1">
                      Delete
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {editModalVisible && (
        <EditEvent
          eventId={eventId}
          modalVisible={editModalVisible}
          setModalVisible={setEditModalVisible}
        />
      )}
    </View>
  );
};
export default EventsLists;

