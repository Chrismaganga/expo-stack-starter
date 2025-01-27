import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { Text, Button, Divider, Card, List } from 'react-native-paper';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardStats from '../components/DashboardStats';
import RecentCertificates from '../components/RecentCertificates';
import RecentDocuments from '../components/RecentDocuments';
import { useCertificateStore } from '../store/store';
import { useResumeStore } from '../store/resumeStore';

export default function HomePage() {
  const certificates = useCertificateStore((state) => state.certificates);
  const resumes = useResumeStore((state) => state.resumes);
  
  const recentCertificates = certificates.slice(0, 3);
  const recentResumes = resumes.slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Manage and create beautiful certificates, resumes, and cover letters
          </Text>
        </View>
        <View style={styles.quickActions}>
          <Card style={[styles.quickActionCard, { backgroundColor: '#2196F3' }]} onPress={() => Linking.openURL('/certificates/new')}>
            <Card.Content style={styles.quickActionContent}>
              <MaterialCommunityIcons name="certificate" size={32} color="white" />
              <Text variant="titleMedium" style={styles.quickActionText}>New Certificate</Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.quickActionCard, { backgroundColor: '#4CAF50' }]} onPress={() => Linking.openURL('/resume/new')}>
            <Card.Content style={styles.quickActionContent}>
              <MaterialCommunityIcons name="file-document-edit" size={32} color="white" />
              <Text variant="titleMedium" style={styles.quickActionText}>New Resume</Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.quickActionCard, { backgroundColor: '#FF9800' }]} onPress={() => Linking.openURL('/cover-letter/new')}>
            <Card.Content style={styles.quickActionContent}>
              <MaterialCommunityIcons name="text-box-edit" size={32} color="white" />
              <Text variant="titleMedium" style={styles.quickActionText}>New Cover Letter</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Overview</Text>
        <Text variant="bodyMedium" style={styles.sectionSubtitle}>
          Track your certificate, resume, and cover letter creation progress
        </Text>
        <DashboardStats />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Resumes
          </Text>
          <Button
            mode="text"
            onPress={() => Linking.openURL('/resume')}
            icon="chevron-right"
            contentStyle={styles.viewAllButton}
          >
            View All
          </Button>
        </View>
        
        {recentResumes.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No resumes yet. Create your first resume to get started!
              </Text>
              <Button
                mode="contained"
                onPress={() => Linking.openURL('/resume/new')}
                style={styles.createButton}
              >
                Create Resume
              </Button>
            </Card.Content>
          </Card>
        ) : (
          recentResumes.map((resume) => (
            <List.Item
              key={resume.id}
              title={`${resume.firstName} ${resume.lastName}`}
              description={resume.jobTitle || 'No job title'}
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Linking.openURL(`/resume/${resume.id}`)}
              style={styles.listItem}
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Recent Documents</Text>
        <RecentDocuments />
      </View>

      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Document Stats</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <MaterialCommunityIcons name="file-document" size={24} color="#2196F3" />
              <Text variant="headlineMedium" style={styles.statsNumber}>
                {resumes.length}
              </Text>
              <Text variant="bodyMedium">Resumes</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statsCard}>
            <Card.Content>
              <MaterialCommunityIcons name="certificate" size={24} color="#2196F3" />
              <Text variant="headlineMedium" style={styles.statsNumber}>
                {certificates.length}
              </Text>
              <Text variant="bodyMedium">Certificates</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.footer}>
        <Divider style={styles.divider} />
        <View style={styles.footerContent}>
          <View>
            <Text variant="bodySmall" style={styles.footerText}>
              Certificate Management System
            </Text>
            <Text variant="bodySmall" style={styles.footerSubtext}>
              Create and manage professional certificates, resumes, and cover letters with ease
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 12,
  },
  quickActionContent: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionText: {
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row-reverse',
  },
  emptyCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  createButton: {
    borderRadius: 8,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
  },
  statsNumber: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
});
