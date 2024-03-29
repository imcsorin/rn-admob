#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RnAdmob, NSObject)

RCT_EXTERN_METHOD(initialize
                  :(NSString *) maxAdContentRating
                  :(NSNumber *) tagForChildDirectedTreatment
                  :(NSNumber *) tagForUnderAgeOfConsent
                  :(RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(createInterstitialAd
                  : (NSString *) unitId
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(createRewardAd
                  : (NSString *) unitId
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(showInterstitialAd
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(showRewardAd
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
