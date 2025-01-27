import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Button, Menu } from 'react-native-paper';
import React, { useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import { useResumeStore } from '../../store/resumeStore';
import ResumeTemplate from '../../components/ResumeTemplate';
import { exportDocument } from '../../utils/documentExport';

export default function ResumeDetailScreen() {
  const { id } = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const resume = useResumeStore((state) =>
    state.resumes.find((r) => r.id === id)
  );

  if (!resume) {
    return (
      <View style={styles.container}>
        <Text>Resume not found</Text>
      </View>
    );
  }

  const handleExport = async () => {
    try {
      setLoading(true);
      const fileName = `${resume.firstName}_${resume.lastName}_resume`;
      await exportDocument({
        viewShotRef,
        documentType: 'resume',
        fileName,
      });
      
      Alert.alert(
        'Success',
        'Resume exported successfully! You can find both PDF and PNG versions in your documents folder.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export resume. Please try again.');
    } finally {
      setLoading(false);
      setMenuVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Resume Preview',
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
          <View style={styles.resumeContainer}>
            <ResumeTemplate resume={resume} />
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
  resumeContainer: {
    backgroundColor: '#fff',
    padding: 20,
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
});
