import { Stack, router } from 'expo-router';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, List, IconButton } from 'react-native-paper';
import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import EducationFormModal from '../../components/EducationFormModal';
import * as DocumentPicker from 'expo-document-picker';

export default function NewResumeScreen() {
  const addResume = useResumeStore((state) => state.addResume);
  const [activeSection, setActiveSection] = useState('personal');
  const [educationModalVisible, setEducationModalVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profileSummary: '',
    
    // Professional Details
    jobTitle: '',
    linkedIn: '',
    portfolio: '',
    
    // Collections
    education: [],
    workExperience: [],
    skills: [],
    languages: [],
    certifications: [],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddEducation = (education: any) => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu: any) => edu.id !== id),
    }));
  };

  const handleImportResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });

      if (result.type === 'success') {
        // Here you would typically parse the document
        // For now, we'll just show a success message
        Alert.alert(
          'File Imported',
          'Resume file imported successfully. Please review and edit the information as needed.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import resume file');
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addResume(formData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'Create New Resume',
          headerShown: true,
          headerRight: () => (
            <Button
              onPress={handleImportResume}
              mode="text"
              icon="file-import"
            >
              Import
            </Button>
          ),
        }}
      />
      
      <SegmentedButtons
        value={activeSection}
        onValueChange={setActiveSection}
        buttons={[
          { value: 'personal', label: 'Personal' },
          { value: 'professional', label: 'Professional' },
          { value: 'education', label: 'Education' },
        ]}
        style={styles.segments}
      />
      
      <ScrollView style={styles.content}>
        {activeSection === 'personal' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Personal Information
            </Text>
            
            <TextInput
              label="First Name *"
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Last Name *"
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Address"
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="City"
              value={formData.city}
              onChangeText={(value) => handleChange('city', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Country"
              value={formData.country}
              onChangeText={(value) => handleChange('country', value)}
              mode="outlined"
              style={styles.input}
            />
          </View>
        )}

        {activeSection === 'professional' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Professional Details
            </Text>
            
            <TextInput
              label="Job Title"
              value={formData.jobTitle}
              onChangeText={(value) => handleChange('jobTitle', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="LinkedIn Profile"
              value={formData.linkedIn}
              onChangeText={(value) => handleChange('linkedIn', value)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
            />
            
            <TextInput
              label="Portfolio URL"
              value={formData.portfolio}
              onChangeText={(value) => handleChange('portfolio', value)}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
            />
            
            <TextInput
              label="Profile Summary"
              value={formData.profileSummary}
              onChangeText={(value) => handleChange('profileSummary', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        {activeSection === 'education' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Education
            </Text>
            
            {formData.education.map((edu: any) => (
              <List.Item
                key={edu.id}
                title={edu.institution}
                description={`${edu.degree} in ${edu.field}\n${edu.startDate} - ${edu.endDate}`}
                left={(props) => <List.Icon {...props} icon="school" />}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => handleRemoveEducation(edu.id)}
                  />
                )}
                style={styles.educationItem}
              />
            ))}
            
            <Button
              mode="contained"
              onPress={() => setEducationModalVisible(true)}
              style={styles.addButton}
              icon="plus"
            >
              Add Education
            </Button>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Create Resume
        </Button>
      </View>

      <EducationFormModal
        visible={educationModalVisible}
        onDismiss={() => setEducationModalVisible(false)}
        onSave={handleAddEducation}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  segments: {
    margin: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  submitButton: {
    borderRadius: 8,
  },
  educationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
});
