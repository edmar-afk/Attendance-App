import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import EventsLists from "../../components/events/EventsLists";
import AddEvent from "../../components/events/AddEvent";
import api from "../../assets/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/events/");
      setEvents(response.data);
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 px-7 flex-col justify-between">
        <View>
          <Text className="font-bold text-2xl mb-2 mt-8">
            Future Events will be displayed here
          </Text>
          <Text className="font-light leading-5">
            Here you can find a list of upcoming events organized by the School
            of JHCSC. Stay updated with all activities, announcements, and
            programs planned for students throughout the semester.
          </Text>
        </View>

        <TouchableOpacity onPress={fetchEvents} className="mt-8 flex flex-row items-center">
          <Ionicons
            name={loading ? "refresh-circle-outline" : "refresh-outline"}
            size={20}
            color="black"
          /> <Text>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-32 px-4">
          {events.length === 0 ? (
            <Text className="text-center mt-8 text-gray-500">
              The school has not yet posted events
            </Text>
          ) : (
            events.map((event) => (
              <EventsLists
                key={event.id}
                eventName={event.event_name}
                description={event.description}
                dateStarted={event.date_started}
                eventId={event.id}
              />
            ))
          )}
        </View>
      </ScrollView>

      <AddEvent refreshEvents={fetchEvents} />
    </View>
  );
};

export default Events;
