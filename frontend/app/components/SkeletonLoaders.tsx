import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, VStack, HStack, Skeleton, SkeletonText } from '@gluestack-ui/themed';
import { useTheme } from '../contexts/ThemeContext';

export const ProductCardSkeleton = () => {
  const { colors } = useTheme();

  return (
    <Box padding="$3" backgroundColor={colors.card} borderRadius={12} style={styles.card}>
      <VStack space="sm">
        <Skeleton height={120} borderRadius={12} />
        <VStack space="xs">
          <SkeletonText numberOfLines={1} />
          <SkeletonText numberOfLines={1} width="60%" />
          <HStack justifyContent="space-between" marginTop="$2">
            <SkeletonText numberOfLines={1} width="40%" />
            <Skeleton height={32} width={32} borderRadius="$full" />
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export const ProductListSkeleton = () => {
  return (
    <View style={styles.grid}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <View key={key} style={styles.gridItem}>
          <ProductCardSkeleton />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});