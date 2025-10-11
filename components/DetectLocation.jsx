import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import * as Location from 'expo-location'

const DetectLocation = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation.coords)
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  return (
    <View className=" bg-white">
      <Text className="text-xl mb-4 font-bold">Detect My Location</Text>
      <Button title="Get My Location" onPress={getLocation} />
      {errorMsg && <Text className="text-red-500 mt-4">{errorMsg}</Text>}
      {location && (
        <View className="mt-4">
          <Text className=''>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      )}
    </View>
  )
}

export default DetectLocation
