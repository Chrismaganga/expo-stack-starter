import { Platform } from 'react-native';

export const defaultAnimationConfig = {
  useNativeDriver: Platform.OS !== 'web',
};

export const fadeConfig = {
  ...defaultAnimationConfig,
  duration: 200,
};

export const slideConfig = {
  ...defaultAnimationConfig,
  duration: 300,
};

export const springConfig = {
  ...defaultAnimationConfig,
  tension: 40,
  friction: 7,
};
