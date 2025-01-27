import { Button, Card, IconButton, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';
/* eslint-disable import/order */
import { Stack, router } from 'expo-router';

import React from 'react';
import { useResumeStore } from '../../store/resumeStore';

export default function ResumeScreen() {
  const resumes = useResumeStore((state) => state.resumes);
  const setCurrentResume = useResumeStore((state) => state.setCurrentResume);
  const deleteResume = useResumeStore((state) => state.deleteResume);

  const handleCreateNew = () => {
    router.push('/resume/new');
  };

  const handleEditResume = (resume: any) => {
    setCurrentResume(resume);
    router.push(`/resume/${resume.id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Resume Builder',
          headerShown: true,
        }}
      />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Create Professional Resume</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Build a standout resume that gets you noticed
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleCreateNew}
            style={styles.button}
            icon="plus"
          >
            Create New Resume
          </Button>
        </View>

        <View style={styles.resumes}>
          {resumes.length === 0 ? (
            <Card style={styles.emptyState}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.emptyStateText}>
                  No resumes yet. Create your first resume to get started!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            resumes.map((resume) => (
              <Card key={resume.id} style={styles.resumeCard}>
                <Card.Content>
                  <View style={styles.resumeHeader}>
                    <View>
                      <Text variant="titleMedium">
                        {resume.firstName} {resume.lastName}
                      </Text>
                      <Text variant="bodyMedium" style={styles.jobTitle}>
                        {resume.jobTitle}
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => handleEditResume(resume)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => deleteResume(resume.id)}
                      />
                    </View>
                  </View>
                  <Text variant="bodySmall" style={styles.lastUpdated}>
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        <View style={styles.features}>
          <Text variant="titleMedium" style={styles.featuresTitle}>
            Features:
          </Text>
          <Text style={styles.featureItem}>• Multiple professional templates</Text>
          <Text style={styles.featureItem}>• ATS-friendly formatting</Text>
          <Text style={styles.featureItem}>• Skills and experience highlighting</Text>
          <Text style={styles.featureItem}>• Export to PDF</Text>
          <Text style={styles.featureItem}>• Real-time preview</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 8,
    color: '#666',
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
  },
  resumes: {
    gap: 16,
    marginBottom: 32,
  },
  resumeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    color: '#666',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
  },
  lastUpdated: {
    color: '#888',
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
  },
  features: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  featuresTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
});
