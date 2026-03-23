import { useEffect, useRef } from 'react';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, InterstitialAdPluginEvents, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Standard Google Test IDs (Replace with your own when going to production)
// Note: Interstitial test ID
const INTERSTITIAL_ID = 'ca-app-pub-5014086119578114/5010047114';
const BANNER_ID = 'ca-app-pub-5014086119578114/4720737659';

export function useAdMob() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize on native platforms to avoid Web errors
    if (Capacitor.isNativePlatform() && !isInitialized.current) {
      console.log('AdMob: Initializing Production...');
      AdMob.initialize({
        testingDevices: [], 
        initializeForTesting: false,
      }).then(() => {
        isInitialized.current = true;
        console.log('AdMob Initialized ✅');
        
        // Pre-load the first Interstitial Ad
        AdMob.prepareInterstitial({
          adId: INTERSTITIAL_ID,
          isTesting: false,
        }).catch(err => {
          console.error('Failed to prepare initial Interstitial', err);
        });

      }).catch(err => {
        console.error('Failed to initialize AdMob', err);
      });
    }
  }, []);

  const showBanner = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const options: BannerAdOptions = {
        adId: BANNER_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false,
      };
      
      console.log('AdMob: Showing Banner...');

      // Update height when ad loads
      AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
        // Adaptive Banners are usually ~50-60px on phones
        // We set 60px as a safe fallback, or use the event data if available
        document.documentElement.style.setProperty('--ad-height', '60px');
      });

      // Also listen for size changes
      AdMob.addListener(BannerAdPluginEvents.SizeChanged, (info) => {
        if (info.height) {
          document.documentElement.style.setProperty('--ad-height', `${info.height}px`);
        }
      });

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
      document.documentElement.style.setProperty('--ad-height', '0px');
    } catch (err) {
      console.error('Failed to hide banner', err);
    }
  };

  const showInterstitial = async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      console.log('AdMob: Requesting Interstitial...');
      await AdMob.showInterstitial();
    } catch (err) {
      console.error('Failed to show Interstitial ad', err);
      
      // Fallback
      AdMob.prepareInterstitial({
        adId: INTERSTITIAL_ID,
        isTesting: false,
      }).catch(e => console.error(e));
    }
  };

  return { showBanner, hideBanner, showInterstitial };
}
