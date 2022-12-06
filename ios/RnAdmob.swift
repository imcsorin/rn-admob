import GoogleMobileAds

@objc(RnAdmob)
class RnAdmob: NSObject {
  private var requestedInterstitialAd: GADInterstitialAd?

  @objc public func initialize(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
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

  @objc public func showRewardAd(
    _ unitId: String,
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let rootViewController = UIApplication.shared.delegate?.window??.rootViewController
    let request = GADRequest()
    GADRewardedAd.load(
      withAdUnitID: unitId,
      request: request,
      completionHandler: { ad, error in
        if let error = error {
          reject("Reward ad error:", error.localizedDescription, error)
          return
        }
        ad?.present(
          fromRootViewController: rootViewController!,
          userDidEarnRewardHandler: {

            resolve(["type": ad?.adReward.type ?? "", "amount": ad?.adReward.amount ?? 0])
          })
      }
    )

  }
}
