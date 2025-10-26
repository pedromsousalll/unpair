import React from 'react';
import { Text, StyleSheet, ViewStyle, View } from 'react-native';

interface GraffitiHeaderProps {
  children: string;
  color?: string;
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
}

export const GraffitiHeader: React.FC<GraffitiHeaderProps> = ({
  children,
  color = '#f1b311',
  size = 'large',
  style,
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'large':
        return 36;
      case 'medium':
        return 28;
      case 'small':
        return 20;
      default:
        return 36;
    }
  };

  return (
    <View style={style}>
      <Text 
        style={[
          styles.text,
          { 
            fontSize: getFontSize(),
            color: color,
          }
        ]}
      >
        {children.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    letterSpacing: 2,
  },
});