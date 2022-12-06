package com.rnadmob;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@ReactModule(name = RnAdmobModule.NAME)
public class RnAdmobModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RnAdmob";
  private List<String> testDeviceIds = new ArrayList<>();
  private InterstitialAd requestedInterstitialAd = null;

  public RnAdmobModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void setTestDeviceIds(ReadableArray options, final Promise promise) {
    List<String> deviceIds = new ArrayList<String>(options.size());
    for (Object object : options.toArrayList()) {
      deviceIds.add(object != null ? object.toString() : null);
    }

    testDeviceIds = deviceIds;
    promise.resolve(new Object());
  }

  @ReactMethod
  public void initialize(final Promise promise) {
    Context context = getReactApplicationContext();
    Activity activity = getCurrentActivity();
    if (activity == null || context == null) {
      promise.reject("Initialization error:", "unable to get current activity");
      return;
    };

    Object adMobIdentifier = null;
    try {
      ApplicationInfo ai;
      ai = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA);
      adMobIdentifier = (Object) ai.metaData.get("com.google.android.gms.ads.APPLICATION_ID");
    } catch (Exception e) {}

    if (adMobIdentifier == null) {
      promise.reject("Initialization error:", "You have to define com.google.android.gms.ads.APPLICATION_ID");
      return;
    }

    MobileAds.initialize(activity, initializationStatus -> promise.resolve(true));
    RequestConfiguration configuration =
            new RequestConfiguration.Builder().setTestDeviceIds(testDeviceIds).build();
    MobileAds.setRequestConfiguration(configuration);
  }

  @ReactMethod
  public void showInterstitialAd(final Promise promise) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("Interstitial ad error:", "unable to get current activity");
      return;
    };

    UiThreadUtil.runOnUiThread(() -> {
      requestedInterstitialAd.show(activity);
      promise.resolve(true);
    });
  }

  @ReactMethod
  public void createInterstitialAd(String unitId, final Promise promise) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("Interstitial ad error:", "unable to get current activity");
      return;
    };

    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        AdRequest adRequest = new AdRequest.Builder().build();
        InterstitialAd.load(activity, Objects.requireNonNull(unitId), adRequest, new InterstitialAdLoadCallback() {
          @Override
          public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
            super.onAdFailedToLoad(loadAdError);
            promise.reject("Interstitial ad error:", loadAdError.getMessage());
          }

          @Override
          public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
            super.onAdLoaded(interstitialAd);
            requestedInterstitialAd = interstitialAd;
            promise.resolve(true);
          }
        });
      }
    });
  }

  @ReactMethod
  public void showRewardAd(String unitId, final Promise promise) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("Reward ad error:", "unable to get current activity");
      return;
    };

    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        AdRequest adRequest = new AdRequest.Builder().build();
        RewardedAd.load(activity, Objects.requireNonNull(unitId), adRequest, new RewardedAdLoadCallback() {
          @Override
          public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
            super.onAdFailedToLoad(loadAdError);
          }

          @Override
          public void onAdLoaded(@NonNull RewardedAd interstitialAd) {
            super.onAdLoaded(interstitialAd);
            interstitialAd.show(activity, rewardItem -> {
              WritableMap m = new WritableNativeMap();
              m.putString("type", rewardItem.getType());
              m.putInt("amount", rewardItem.getAmount());
              promise.resolve(m);
            });
          }
        });

      }
    });
  }
}
