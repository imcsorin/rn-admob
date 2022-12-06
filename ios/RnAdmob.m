#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RnAdmob, NSObject)

RCT_EXTERN_METHOD(initialize
                  :(RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(createInterstitialAd
                  : (NSString *) unitId
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(showInterstitialAd
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(showRewardAd
                  : (NSString *) unitId
                  : (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
