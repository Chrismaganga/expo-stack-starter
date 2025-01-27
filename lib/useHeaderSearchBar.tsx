import { useNavigation } from 'expo-router';
import * as React from 'react';
import { Platform } from 'react-native';
import { SearchBarProps } from 'react-native-screens';

import { useColorScheme } from './useColorScheme';

import { COLORS } from '~/theme/colors';

export function useHeaderSearchBar(props: SearchBarProps = {}) {
  const { colorScheme, colors } = useColorScheme();
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');

  // Use useEffect for SSR compatibility
  React.useEffect(() => {
    // Skip header search bar setup on web SSR
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }

    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search...',
        barTintColor: colorScheme === 'dark' ? COLORS.black : COLORS.white,
        textColor: colors.foreground,
        tintColor: colors.primary,
        headerIconColor: colors.foreground,
        hintTextColor: colors.grey,
        hideWhenScrolling: false,
        onChangeText(ev) {
          setSearch(ev.nativeEvent.text);
        },
        ...props,
      } satisfies SearchBarProps,
    });
  }, [navigation, colorScheme, colors, props]);

  return search;
}
