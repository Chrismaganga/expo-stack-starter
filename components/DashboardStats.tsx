import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCertificateStore } from '../store/store';
import { useResumeStore } from '../store/resumeStore';

export default function DashboardStats() {
  const theme = useTheme();
  const certificates = useCertificateStore((state) => state.certificates);
  const resumes = useResumeStore((state) => state.resumes);

  const stats = [
    {
      icon: 'certificate',
      label: 'Certificates',
      value: certificates.length,
      color: theme.colors.primary,
    },
    {
      icon: 'file-document',
      label: 'Resumes',
      value: resumes.length,
      color: '#4CAF50',
    },
    {
      icon: 'text-box-edit',
      label: 'Cover Letters',
      value: 0, // Will be updated when cover letter store is implemented
      color: '#FF9800',
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons
              name={stat.icon}
              size={32}
              color={stat.color}
              style={styles.icon}
            />
            <Text variant="headlineMedium" style={styles.number}>
              {stat.value}
            </Text>
            <Text variant="bodyMedium" style={styles.label}>
              {stat.label}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  card: {
    flex: 1,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 8,
  },
  number: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    color: '#666',
  },
});
