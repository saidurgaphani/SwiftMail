import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.swiftmail.app',
  appName: 'SwiftMail',
  webDir: 'out',
  server: {
    url: 'https://swiftmail-sm.vercel.app',
    cleartext: true,
    errorPath: 'offline.html'
  }
};

export default config;
