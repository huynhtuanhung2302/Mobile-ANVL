/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const tactical = {
  danger: '#FF3B30',
  warning: '#FF9500',
  safe: '#34C759',
  primary: '#0A84FF',
  base: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  muted: '#8E8E93',

  // Priority specific
  alert: '#FF3B30',      // Red for Alert
  incident: '#34C759',   // Green for Incident
  maintenance: '#017AFF', // Blue for Maintenance
};

export const Colors = {
  light: {
    background: '#F2F2F7', // iOS Light Gray System Background
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    ...tactical,
    // OVERRIDE tactical dark-defaults for Light Mode
    base: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    muted: '#8E8E93',
  },
  dark: {
    background: tactical.base,
    tint: tactical.primary,
    icon: tactical.muted,
    tabIconDefault: tactical.muted,
    tabIconSelected: tactical.primary,
    ...tactical,
  },
  tactical,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
