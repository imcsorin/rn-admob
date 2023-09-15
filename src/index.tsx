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

export enum TagForChildDirectedTreatment {
  false = 0,
  true = 1,
  unspecified = -1,
}

export enum TagForUnderAgeOfConsent {
  false = 0,
  true = 1,
  unspecified = -1,
}

export enum MaxAdContentRating {
  general = 'G',
  mature = 'MA',
  parentalGuidance = 'PG',
  teen = 'T',
  unspecified = '',
}

const useInitialize = ({
  skip,
  maxAdContentRating = MaxAdContentRating.unspecified,
  tagForChildDirectedTreatment = TagForChildDirectedTreatment.unspecified,
  tagForUnderAgeOfConsent = TagForUnderAgeOfConsent.unspecified,
}: {
  skip?: boolean;
  maxAdContentRating?: MaxAdContentRating;
  tagForChildDirectedTreatment?: TagForChildDirectedTreatment;
  tagForUnderAgeOfConsent?: TagForUnderAgeOfConsent;
}): boolean => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  const f = React.useCallback(async () => {
    try {
      const resp = await RnAdmob.initialize(
        maxAdContentRating,
        tagForChildDirectedTreatment,
        tagForUnderAgeOfConsent
      );
      setIsInitialized(resp);
    } catch {
      setIsInitialized(false);
    }
  }, [
    maxAdContentRating,
    tagForChildDirectedTreatment,
    tagForUnderAgeOfConsent,
  ]);

  React.useEffect(() => {
    !skip && f();
  }, [skip, f]);

  return isInitialized;
};

const showInterstitialAd = async () => await RnAdmob.showInterstitialAd();
const createInterstitialAd = async (unitId: string): Promise<boolean> =>
  await RnAdmob.createInterstitialAd(unitId);
const showRewardAd = async (): Promise<{ type: string; amount: number }> =>
  await RnAdmob.showRewardAd();
const createRewardAd = async (unitId: string): Promise<boolean> =>
  await RnAdmob.createRewardAd(unitId);

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
  createRewardAd,
  TestIds,
};
