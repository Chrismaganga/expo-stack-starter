import { Stack, router } from 'expo-router';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import React, { useState } from 'react';
import { useCoverLetterStore } from '../../store/coverLetterStore';

export default function NewCoverLetterScreen() {
  const addCoverLetter = useCoverLetterStore((state) => state.addCoverLetter);
  const [activeSection, setActiveSection] = useState('personal');
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    
    // Job Details
    companyName: '',
    jobTitle: '',
    hiringManager: '',
    
    // Letter Content
    greeting: 'Dear Hiring Manager,',
    introduction: '',
    body: '',
    conclusion: '',
    signature: 'Best regards,',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.companyName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addCoverLetter(formData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'Create Cover Letter',
          headerShown: true,
        }}
      />
      
      <SegmentedButtons
        value={activeSection}
        onValueChange={setActiveSection}
        buttons={[
          { value: 'personal', label: 'Personal' },
          { value: 'job', label: 'Job Details' },
          { value: 'content', label: 'Letter' },
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

        {activeSection === 'job' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Job Details
            </Text>
            
            <TextInput
              label="Company Name *"
              value={formData.companyName}
              onChangeText={(value) => handleChange('companyName', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Job Title"
              value={formData.jobTitle}
              onChangeText={(value) => handleChange('jobTitle', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Hiring Manager Name"
              value={formData.hiringManager}
              onChangeText={(value) => handleChange('hiringManager', value)}
              mode="outlined"
              style={styles.input}
            />
          </View>
        )}

        {activeSection === 'content' && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Letter Content
            </Text>
            
            <TextInput
              label="Greeting"
              value={formData.greeting}
              onChangeText={(value) => handleChange('greeting', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Introduction"
              value={formData.introduction}
              onChangeText={(value) => handleChange('introduction', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Introduce yourself and state the position you're applying for"
            />
            
            <TextInput
              label="Body"
              value={formData.body}
              onChangeText={(value) => handleChange('body', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={8}
              placeholder="Highlight your relevant experience and skills"
            />
            
            <TextInput
              label="Conclusion"
              value={formData.conclusion}
              onChangeText={(value) => handleChange('conclusion', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder="Thank the reader and express your interest in further discussion"
            />
            
            <TextInput
              label="Signature"
              value={formData.signature}
              onChangeText={(value) => handleChange('signature', value)}
              mode="outlined"
              style={styles.input}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Create Cover Letter
        </Button>
      </View>
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
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  submitButton: {
    borderRadius: 8,
  },
});
