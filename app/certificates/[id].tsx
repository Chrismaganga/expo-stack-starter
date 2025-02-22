/* eslint-disable prettier/prettier */
import { CertificateInterface, CertificatePreview } from '../../components/CertificatePreview';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import { Text } from 'react-native-paper';
import { useCertificateStore } from '../../store/store';

export default function CertificateDetailsPage() {
  const { id } = useLocalSearchParams();
  console.log('Retrieved ID:', id);
  const certificates = useCertificateStore((state) => state.certificates);
  console.log('Certificates:', certificates);
  const certificate = certificates.find(cert => cert.id === id) as CertificateInterface;

  if (!certificate) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium">Certificate not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: `${certificate.recipientName}'s Certificate`,
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {certificate.courseName}
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            Awarded to {certificate.recipientName}
          </Text>
        </View>

        <View style={styles.previewSection}>
          <CertificatePreview certificate={certificate} />    
        </View>

        <View style={styles.details}>
          <DetailItem label="Completion Date" value={certificate.completionDate} />
          <DetailItem label="Duration" value={certificate.duration} />
          <DetailItem label="Grade" value={certificate.grade || 'Not Graded'} />
          <DetailItem label="Issuer" value={`${certificate.issuerName} (${certificate.issuerTitle})`} />
        </View>
      </View>
    </View>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text variant="bodyMedium" style={styles.label}>{label}</Text>
      <Text variant="bodyLarge" style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  previewSection: {
    marginBottom: 24,
  },
  details: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    gap: 16,
  },
  detailItem: {
    gap: 4,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: '500',
  },
});
