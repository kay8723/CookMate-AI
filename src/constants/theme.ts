import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#006C51',
    secondary: '#526D82',
    tertiary: '#9DB2BF',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#B00020',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#C7C7CD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF4081',
  },
  fonts: configureFonts({ config: fontConfig }),
}; 