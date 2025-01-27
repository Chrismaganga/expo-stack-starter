import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCertificateStore } from '../store/store';

export default function DashboardStats() {
  const certificates = useCertificateStore((state) => state.certificates);

  const stats = {
    total: certificates.length,
    thisMonth: certificates.filter(cert => {
      const certDate = new Date(cert.createdAt);
      const now = new Date();
      return certDate.getMonth() === now.getMonth() && 
             certDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContent}>
              <MaterialCommunityIcons name="certificate" size={32} color="#6366f1" />
              <View>
                <Text variant="titleLarge" style={styles.number}>{stats.total}</Text>
                <Text variant="bodyMedium">Total Certificates</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardContent}>
              <MaterialCommunityIcons name="calendar-month" size={32} color="#6366f1" />
              <View>
                <Text variant="titleLarge" style={styles.number}>{stats.thisMonth}</Text>
                <Text variant="bodyMedium">This Month</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: 150,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  number: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
});
