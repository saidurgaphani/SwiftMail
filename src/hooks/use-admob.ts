import { useEffect, useRef } from 'react';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Standard Google Test IDs (Replace with your own when going to production)
// Note: Interstitial test ID
const INTERSTITIAL_TEST_ID = 'ca-app-pub-3940256099942544/1033173712';
const BANNER_TEST_ID = 'ca-app-pub-3940256099942544/6300978111';

export function useAdMob() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize on native platforms to avoid Web errors
    if (Capacitor.isNativePlatform() && !isInitialized.current) {
      AdMob.initialize({
        testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'], // Example device ID
        initializeForTesting: true,
      }).then(() => {
        isInitialized.current = true;
        console.log('AdMob Initialized');

        // Pre-load the first Interstitial Ad so it's ready instantly
        AdMob.prepareInterstitial({
          adId: INTERSTITIAL_TEST_ID,
          isTesting: true,
        }).catch(err => console.error('Failed to prepare initial Interstitial', err));

        // When the user closes an Interstitial, automatically load the next one
        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          AdMob.prepareInterstitial({
            adId: INTERSTITIAL_TEST_ID,
            isTesting: true,
          }).catch(err => console.error('Failed to prepare next Interstitial', err));
        });

      }).catch(err => {
        console.error('Failed to initialize AdMob', err);
      });
    }
  }, []);

  const showBanner = async () => {
    if (!Capacitor.isNativePlatform()) return;

    const options: BannerAdOptions = {
      adId: BANNER_TEST_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 130, // Offset for the bottom navbar + safe area (increased to avoid overlap)
      isTesting: true,
      // npa: true
    };
    
    try {
      await AdMob.showBanner(options);
    } catch (err) {
      console.error('Failed to show banner', err);
    }
  };

  const hideBanner = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.hideBanner();
      await AdMob.removeBanner();
    } catch (err) {
      console.error('Failed to hide banner', err);
    }
  };

  const showInterstitial = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await AdMob.showInterstitial();
    } catch (err) {
      console.error('Failed to show Interstitial ad', err);
      // Fallback: If it failed, try to prepare it again for next time
      AdMob.prepareInterstitial({
        adId: INTERSTITIAL_TEST_ID,
        isTesting: true,
      }).catch(e => console.error(e));
    }
  };

  return { showBanner, hideBanner, showInterstitial };
}
