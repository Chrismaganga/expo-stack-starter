import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack } from 'expo-router';
import CertificateForm from '../../components/CertificateForm';
import CertificatePreview from '../../components/CertificatePreview';

export default function NewCertificatePage() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Create Certificate',
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Create New Certificate</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Fill in the details below to generate a beautiful certificate
        </Text>
        
        <View style={styles.formSection}>
          <CertificateForm />
        </View>

        <View style={styles.previewSection}>
          <Text variant="titleLarge" style={styles.previewTitle}>Preview</Text>
          <CertificatePreview />
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  previewSection: {
    marginBottom: 30,
  },
  previewTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
