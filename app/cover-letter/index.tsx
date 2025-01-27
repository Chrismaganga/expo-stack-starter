import { Stack, router } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, Card, IconButton, List } from 'react-native-paper';
import React from 'react';
import { useCoverLetterStore } from '../../store/coverLetterStore';

export default function CoverLetterScreen() {
  const coverLetters = useCoverLetterStore((state) => state.coverLetters);
  const setCurrentCoverLetter = useCoverLetterStore((state) => state.setCurrentCoverLetter);
  const deleteCoverLetter = useCoverLetterStore((state) => state.deleteCoverLetter);

  const handleCreateNew = () => {
    router.push('/cover-letter/new');
  };

  const handleEditCoverLetter = (coverLetter: any) => {
    setCurrentCoverLetter(coverLetter);
    router.push(`/cover-letter/${coverLetter.id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Cover Letters',
          headerShown: true,
        }}
      />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Cover Letter Builder</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Create professional cover letters tailored to each job
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleCreateNew}
            style={styles.button}
            icon="plus"
          >
            Create New Cover Letter
          </Button>
        </View>

        <View style={styles.coverLetters}>
          {coverLetters.length === 0 ? (
            <Card style={styles.emptyState}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.emptyStateText}>
                  No cover letters yet. Create your first cover letter to get started!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            coverLetters.map((letter) => (
              <Card key={letter.id} style={styles.letterCard}>
                <Card.Content>
                  <View style={styles.letterHeader}>
                    <View>
                      <Text variant="titleMedium">
                        {letter.firstName} {letter.lastName}
                      </Text>
                      <Text variant="bodyMedium" style={styles.company}>
                        {letter.companyName} - {letter.jobTitle}
                      </Text>
                    </View>
                    <View style={styles.cardActions}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => handleEditCoverLetter(letter)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => deleteCoverLetter(letter.id)}
                      />
                    </View>
                  </View>
                  <Text variant="bodySmall" style={styles.lastUpdated}>
                    Last updated: {new Date(letter.updatedAt).toLocaleDateString()}
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
          <Text style={styles.featureItem}>• AI-powered content suggestions</Text>
          <Text style={styles.featureItem}>• Professional templates</Text>
          <Text style={styles.featureItem}>• Easy customization</Text>
          <Text style={styles.featureItem}>• Export to PDF</Text>
          <Text style={styles.featureItem}>• Multiple formats supported</Text>
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
  coverLetters: {
    gap: 16,
    marginBottom: 32,
  },
  letterCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  letterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  company: {
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
