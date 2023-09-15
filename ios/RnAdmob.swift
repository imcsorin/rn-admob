import GoogleMobileAds

@objc(RnAdmob)
class RnAdmob: NSObject {
  private var requestedInterstitialAd: GADInterstitialAd?
  private var requestedRewardAd: GADRewardedAd?

  @objc public func initialize(
    _ maxAdContentRating: GADMaxAdContentRating,
    _ tagForChildDirectedTreatment: Int,
    _ tagForUnderAgeOfConsent: Int,
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    GADMobileAds.sharedInstance().requestConfiguration.maxAdContentRating = maxAdContentRating

    if tagForChildDirectedTreatment != -1 {
      GADMobileAds.sharedInstance().requestConfiguration.tag(
        forChildDirectedTreatment: tagForChildDirectedTreatment == 1)
    }
    if tagForUnderAgeOfConsent != -1 {
      GADMobileAds.sharedInstance().requestConfiguration.tagForUnderAge(
        ofConsent: tagForUnderAgeOfConsent == 1)
    }

    GADMobileAds.sharedInstance().start(completionHandler: {
      GADInitializationStatus -> Void in
      resolve(true)
    })
  }

  @objc public func showInterstitialAd(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
    DispatchQueue.main.async { [self, rootViewController] in
      if requestedInterstitialAd != nil {
        requestedInterstitialAd!.present(fromRootViewController: rootViewController!)
        resolve(true)
      } else {
        reject("Interstitial ad error:", "not loaded", Error.self as? Error)
      }
    }
  }

  @objc public func createInterstitialAd(
    _ unitId: String,
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let request = GADRequest()
    GADInterstitialAd.load(
      withAdUnitID: unitId, request: request,
      completionHandler: { [self] ad, error in
        if let error = error {
          reject("Interstitial ad error:", error.localizedDescription, error)
          return
        }
        requestedInterstitialAd = ad
        resolve(true)
      }
    )
  }

  @objc public func createRewardAd(
    _ unitId: String,
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let request = GADRequest()
    GADRewardedAd.load(
      withAdUnitID: unitId,
      request: request,
      completionHandler: { [self] ad, error in
        if let error = error {
          reject("Reward ad error:", error.localizedDescription, error)
          return
        }
        requestedRewardAd = ad
        resolve(true)
      }
    )
  }

  @objc public func showRewardAd(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {

    let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
    DispatchQueue.main.async { [self, rootViewController] in
      if requestedInterstitialAd != nil {
        requestedRewardAd!.present(
          fromRootViewController: rootViewController!,
          userDidEarnRewardHandler: {
            resolve([
              "type": requestedRewardAd?.adReward.type ?? "",
              "amount": requestedRewardAd?.adReward.amount ?? 0,
            ])
          })

      } else {
        reject("Interstitial ad error:", "not loaded", Error.self as? Error)
      }
    }
  }
}
