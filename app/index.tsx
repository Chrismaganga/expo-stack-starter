import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardStats from '../components/DashboardStats';
import RecentCertificates from '../components/RecentCertificates';

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Manage and create beautiful certificates
          </Text>
        </View>
        <Link href="/certificates/new" asChild>
          <Button 
            mode="contained" 
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="plus" size={size} color={color} />
            )}
          >
            New Certificate
          </Button>
        </Link>
      </View>

      <View style={styles.statsSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Overview</Text>
        <Text variant="bodyMedium" style={styles.sectionSubtitle}>
          Track your certificate creation progress
        </Text>
        <DashboardStats />
      </View>
      
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Recent Certificates</Text>
        <Text variant="bodyMedium" style={styles.sectionSubtitle}>
          View and manage your latest certificates
        </Text>
        <RecentCertificates />
      </View>

      <View style={styles.footer}>
        <Divider style={styles.divider} />
        <View style={styles.footerContent}>
          <View>
            <Text variant="bodySmall" style={styles.footerText}>
              Certificate Management System
            </Text>
            <Text variant="bodySmall" style={styles.footerSubtext}>
              Create and manage professional certificates with ease
            </Text>
          </View>
          <Text 
            variant="bodyMedium" 
            style={styles.companyLink}
            onPress={() => Linking.openURL('https://codelovers.co.za')}
          >
            codelovers.co.za
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  statsSection: {
    marginTop: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    paddingHorizontal: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  footer: {
    marginTop: 40,
    paddingBottom: 24,
  },
  divider: {
    backgroundColor: '#e5e7eb',
    marginBottom: 24,
  },
  footerContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#374151',
    fontWeight: '500',
  },
  footerSubtext: {
    color: '#6b7280',
    marginTop: 4,
  },
  companyLink: {
    color: '#6366f1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
