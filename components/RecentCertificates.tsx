import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { Link } from 'expo-router';
import { useCertificateStore } from '../store/store';

export default function RecentCertificates() {
  const certificates = useCertificateStore((state) => state.certificates);
  
  // Get last 5 certificates, sorted by date
  const recentCertificates = [...certificates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recentCertificates.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Card.Content>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No certificates created yet. Start by creating your first certificate!
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {recentCertificates.map((cert) => (
        <Link key={cert.id} href={`/certificates/${cert.id}`} asChild>
          <Pressable>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Avatar.Text 
                  size={40} 
                  label={cert.recipientName.substring(0, 2).toUpperCase()} 
                  style={styles.avatar}
                />
                <View style={styles.certInfo}>
                  <Text variant="titleMedium" numberOfLines={1}>
                    {cert.recipientName}
                  </Text>
                  <Text variant="bodyMedium" style={styles.courseText} numberOfLines={1}>
                    {cert.courseName}
                  </Text>
                  <Text variant="bodySmall" style={styles.dateText}>
                    {new Date(cert.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  certInfo: {
    flex: 1,
  },
  avatar: {
    backgroundColor: '#6366f1',
  },
  courseText: {
    color: '#6b7280',
  },
  dateText: {
    color: '#9ca3af',
  },
  emptyCard: {
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
  },
});
