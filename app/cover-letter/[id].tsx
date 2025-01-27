import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Button, Menu } from 'react-native-paper';
import React, { useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import { useCoverLetterStore } from '../../store/coverLetterStore';
import { exportDocument } from '../../utils/documentExport';

export default function CoverLetterDetailScreen() {
  const { id } = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const coverLetter = useCoverLetterStore((state) =>
    state.coverLetters.find((c) => c.id === id)
  );

  if (!coverLetter) {
    return (
      <View style={styles.container}>
        <Text>Cover Letter not found</Text>
      </View>
    );
  }

  const handleExport = async () => {
    try {
      setLoading(true);
      const fileName = `${coverLetter.firstName}_${coverLetter.lastName}_${coverLetter.companyName}`;
      await exportDocument({
        viewShotRef,
        documentType: 'cover-letter',
        fileName,
      });
      
      Alert.alert(
        'Success',
        'Cover Letter exported successfully! You can find both PDF and PNG versions in your documents folder.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export cover letter. Please try again.');
    } finally {
      setLoading(false);
      setMenuVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Cover Letter Preview',
          headerRight: () => (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  onPress={() => setMenuVisible(true)}
                  mode="text"
                  icon="export"
                  loading={loading}
                  disabled={loading}
                >
                  Export
                </Button>
              }
            >
              <Menu.Item
                onPress={handleExport}
                title="Export as PDF & PNG"
                leadingIcon="file-export"
                disabled={loading}
              />
            </Menu>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <View style={styles.letterContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.name}>
                {coverLetter.firstName} {coverLetter.lastName}
              </Text>
              <Text style={styles.contact}>{coverLetter.email}</Text>
              <Text style={styles.contact}>{coverLetter.phone}</Text>
              <Text style={styles.contact}>
                {coverLetter.address}, {coverLetter.city}, {coverLetter.country}
              </Text>
            </View>

            {/* Date */}
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>

            {/* Company Info */}
            <View style={styles.companyInfo}>
              <Text style={styles.text}>{coverLetter.companyName}</Text>
              {coverLetter.hiringManager && (
                <Text style={styles.text}>Attn: {coverLetter.hiringManager}</Text>
              )}
            </View>

            {/* Letter Content */}
            <View style={styles.letterContent}>
              <Text style={styles.text}>{coverLetter.greeting}</Text>
              
              <Text style={[styles.text, styles.paragraph]}>
                {coverLetter.introduction}
              </Text>
              
              <Text style={[styles.text, styles.paragraph]}>
                {coverLetter.body}
              </Text>
              
              <Text style={[styles.text, styles.paragraph]}>
                {coverLetter.conclusion}
              </Text>

              <View style={styles.signature}>
                <Text style={styles.text}>{coverLetter.signature}</Text>
                <Text style={[styles.text, styles.signatureName]}>
                  {coverLetter.firstName} {coverLetter.lastName}
                </Text>
              </View>
            </View>
          </View>
        </ViewShot>
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
  },
  letterContainer: {
    backgroundColor: '#fff',
    padding: 40,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contact: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#444',
    marginBottom: 24,
  },
  companyInfo: {
    marginBottom: 24,
  },
  letterContent: {
    gap: 16,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  paragraph: {
    marginTop: 8,
  },
  signature: {
    marginTop: 32,
  },
  signatureName: {
    marginTop: 16,
    fontWeight: '500',
  },
});
