import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  // @ts-ignore
  global.window = global.window || {};
  
  // @ts-ignore
  global.document = global.document || {
    // Mock the head object with appendChild
    head: {
      appendChild: () => {}, 
    },
    // Mock other common methods
    getElementsByTagName: () => [],
    createElement: () => ({}),
    getElementById: () => null,
  };
}