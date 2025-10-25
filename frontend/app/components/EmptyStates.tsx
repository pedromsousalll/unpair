import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, VStack, Text, Button, ButtonText } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'cube-outline',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();

  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="$8">
      <VStack space="md" alignItems="center" maxWidth={300}>
        <Box
          width={80}
          height={80}
          borderRadius="$full"
          backgroundColor={colors.surface}
          justifyContent="center"
          alignItems="center"
          marginBottom="$4"
        >
          <Ionicons name={icon as any} size={40} color={colors.textSecondary} />
        </Box>
        <Text fontSize="$xl" fontWeight="$bold" color={colors.text} textAlign="center">
          {title}
        </Text>
        {description && (
          <Text size="md" color={colors.textSecondary} textAlign="center">
            {description}
          </Text>
        )}
        {actionLabel && onAction && (
          <Button size="lg" onPress={onAction} marginTop="$4" borderRadius="$full">
            <ButtonText>{actionLabel}</ButtonText>
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export const NoResultsState: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
  <EmptyState
    icon="search-outline"
    title="No results found"
    description="Try adjusting your search or filters"
    actionLabel={onReset ? "Clear Search" : undefined}
    onAction={onReset}
  />
);

export const NoDataState: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <EmptyState
    icon="cube-outline"
    title={title}
    description={description}
  />
);

export const ErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon="alert-circle-outline"
    title="Oops! Something went wrong"
    description="We couldn't load the data. Please try again."
    actionLabel="Retry"
    onAction={onRetry}
  />
);

export const OfflineState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon="cloud-offline-outline"
    title="You're offline"
    description="Check your internet connection and try again."
    actionLabel="Retry"
    onAction={onRetry}
  />
);