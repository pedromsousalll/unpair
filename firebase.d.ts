// firebase.d.ts

import { AuthPersistence } from '@firebase/auth-types';

declare module 'firebase/auth' {
  // Reexport tudo o que já existe
  export * from '@firebase/auth';

  /**
   * Expo/React Native persistence using AsyncStorage.
   * TS às vezes não reconhece, mas a função existe no runtime.
   */
  export function getReactNativePersistence(storage: any): AuthPersistence;
}
