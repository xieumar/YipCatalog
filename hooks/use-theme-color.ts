import { theme } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof theme.colors
) {
  const colorFromProps = props.light || props.dark;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme.colors[colorName];
  }
}
