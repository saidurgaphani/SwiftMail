import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.swiftmail.app',
  appName: 'SwiftMail',
  webDir: 'out',
  plugins: {
    AdMob: {
      // Dummy Android App ID (Testing only). Replace with your actual AdMob App ID.
      appId: 'ca-app-pub-3940256099942544~3347511713'
    }
  }
};

export default config;
