import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  createInterstitialAd,
  showInterstitialAd,
  createRewardAd,
  showRewardAd,
  TagForUnderAgeOfConsent,
  TestIds,
  useInitialize,
} from '@imcsorin/rn-admob';

export default function App() {
  const [consent, setConsent] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const isAdMobInitialized = useInitialize({
    skip: !consent,
    tagForUnderAgeOfConsent: TagForUnderAgeOfConsent.true,
  });

  const giveConsent = () => setConsent(true);

  const onInterstitialAdPress = async () => {
    try {
      await showInterstitialAd();
    } catch (e) {
      setMsg(`Interstitial -> ${e}`);
    }
  };

  const onLoadInterstitialAdPress = async () => {
    try {
      await createInterstitialAd(TestIds.interstitial);
      setMsg(`Loaded interstitial ad`);
    } catch (e) {
      setMsg(`Interstitial -> ${e}`);
    }
  };

  const onRewardAdPress = async () => {
    try {
      const resp = await showRewardAd();
      setMsg(JSON.stringify(resp));
    } catch (e) {
      setMsg(`Reward -> ${e}`);
    }
  };

  const onLoadRewardAdPress = async () => {
    try {
      await createRewardAd(TestIds.interstitial);
      setMsg(`Loaded reward ad`);
    } catch (e) {
      setMsg(`Interstitial -> ${e}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={giveConsent} style={styles.element}>
        <Text>Give consent</Text>
      </TouchableOpacity>
      <Text>Result: {isAdMobInitialized ? 'YES' : 'NO'}</Text>
      <TouchableOpacity onPress={onInterstitialAdPress} style={styles.element}>
        <Text>Try interstitial ad</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLoadInterstitialAdPress}
        style={styles.element}
      >
        <Text>Load interstitial ad</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRewardAdPress} style={styles.element}>
        <Text>Try reward ad</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLoadRewardAdPress} style={styles.element}>
        <Text>Load reward ad</Text>
      </TouchableOpacity>
      <Text>{msg}</Text>
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
