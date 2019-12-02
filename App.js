import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CarbonFootprint from './components/CarbonFootprint'

export default function App () {
  return (
    <View style={styles.container}>
      <CarbonFootprint/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cfff6e',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
