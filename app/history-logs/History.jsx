import { View, Text } from 'react-native'
import React from 'react'
import HistoryCard from '../../components/history/HistoryCard'

const history = () => {
  return (
    <View className='flex-1 px-4 pr-8 mt-8'>
      <HistoryCard/>
    </View>
  )
}

export default history