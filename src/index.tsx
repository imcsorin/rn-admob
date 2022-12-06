import React from 'react';
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@imcsorin/rn-admob' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RnAdmob = NativeModules.RnAdmob
  ? NativeModules.RnAdmob
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const useInitialize = (skip?: boolean): boolean => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  const f = async () => {
    try {
      const resp = await RnAdmob.initialize();
      setIsInitialized(resp);
    } catch {
      setIsInitialized(false);
    }
  };

  React.useEffect(() => {
    !skip && f();
  }, [skip]);

  return isInitialized;
};

const showInterstitialAd = async () => await RnAdmob.showInterstitialAd();
const createInterstitialAd = async (unitId: string): Promise<void> =>
  await RnAdmob.createInterstitialAd(unitId);
const showRewardAd = async (
  unitId: string
): Promise<{ type: string; amount: number }> =>
  await RnAdmob.showRewardAd(unitId);

const TestIds: { interstitial: string; reward: string } = Platform.select({
  ios: {
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    reward: 'ca-app-pub-3940256099942544/1712485313',
  },
  android: {
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    reward: 'ca-app-pub-3940256099942544/5224354917',
  },
}) as any;

export {
  useInitialize,
  showInterstitialAd,
  createInterstitialAd,
  showRewardAd,
  TestIds,
};
