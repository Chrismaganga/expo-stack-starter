/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import { Button, Card, List, Text } from 'react-native-paper';
// eslint-disable-next-line import/order
import { StyleSheet, View } from 'react-native';

import { router } from 'expo-router';
import { useCertificateStore } from '../store/store';
import { useResumeStore } from '../store/resumeStore';

/* eslint-disable import/order */


export default function RecentDocuments() {
  const certificates = useCertificateStore((state) => state.certificates);
  const resumes = useResumeStore((state) => state.resumes);

  const recentCertificates = certificates.slice(0, 3);
  const recentResumes = resumes.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Recent Resumes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Resumes
          </Text>
          <Button
            mode="text"
            onPress={() => router.push('/resume')}
            icon="chevron-right"
            contentStyle={styles.viewAllButton}>
            View All
          </Button>
        </View>

        {recentResumes.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No resumes yet. Create your first resume to get started!
              </Text>
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
              onPress={() => router.push(`/resume/${resume.id}`)}
              style={styles.listItem}
            />
          ))
        )}
      </View>

      {/* Recent Certificates */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Certificates
          </Text>
          <Button
            mode="text"
            onPress={() => router.push('/certificates')}
            icon="chevron-right"
            contentStyle={styles.viewAllButton}
          >
            View All
          </Button>
        </View>
        
        {recentCertificates.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No certificates yet. Create your first certificate to get started!
              </Text>
            </Card.Content>
          </Card>
        ) : (
          recentCertificates.map((certificate) => (
            <List.Item
              key={certificate.id}
              title={certificate.courseName}
              description={certificate.recipientName}
              left={(props) => <List.Icon {...props} icon="certificate" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push(`/certificates/${certificate.id}`)}
              onLongPress={() => certificate.saveToGallery(certificate.id)}
          
              style={styles.listItem}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row-reverse',
  },
  emptyCard: {
    borderRadius: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
  },
});
