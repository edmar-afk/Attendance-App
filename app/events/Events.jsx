import { View, Text, ScrollView } from "react-native";
import React from "react";
import EventsLists from "../../components/events/EventsLists";
import AddEvent from "../../components/events/AddEvent";

const Events = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text className="font-bold text-2xl mb-2 mt-8">
          Future Events will be displayed here
        </Text>
        <Text className="font-light leading-5">
          Here you can find a list of upcoming events organized by the School of
          JHCSC. Stay updated with all activities, announcements, and programs
          planned for students throughout the semester.
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className='mb-32'>
          <EventsLists />
          <EventsLists />
          <EventsLists />
          <EventsLists />
        </View>
      </ScrollView>

      <AddEvent />
    </View>
  );
};

export default Events;
