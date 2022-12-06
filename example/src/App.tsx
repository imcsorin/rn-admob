import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  createInterstitialAd,
  showInterstitialAd,
  showRewardAd,
  TestIds,
  useInitialize,
} from 'rn-admob';

export default function App() {
  const [err, setErr] = React.useState('');
  const isAdMobInitialized = useInitialize();

  const onInterstitialAdPress = async () => {
    try {
      await createInterstitialAd(TestIds.interstitial);
      await showInterstitialAd();
    } catch (e) {
      setErr(`${e}`);
    }
  };

  const onRewardAdPress = async () => {
    try {
      await showRewardAd(TestIds.reward);
    } catch (e) {
      setErr(`${e}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Result: {isAdMobInitialized ? 'YES' : 'NO'}</Text>
      <TouchableOpacity onPress={onInterstitialAdPress} style={styles.element}>
        <Text>Try interstitial ad</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRewardAdPress} style={styles.element}>
        <Text>Try reward ad</Text>
      </TouchableOpacity>
      <Text>{err}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  element: {
    marginVertical: 20,
    backgroundColor: 'gray',
  },
});
