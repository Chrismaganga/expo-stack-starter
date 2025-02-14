import { Button, TextInput, SegmentedButtons, MD3Colors } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useCertificateStore } from '../store/store';
import type { Certificate } from '../store/store';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

interface FormData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  issuerName: string;
  issuerTitle: string;
  grade: string;
  duration: string;
  description: string;
  achievements: string[];
  logo?: string;
  templateStyle: 'classic' | 'modern' | 'minimal';
  accentColor: string;
}

const TEMPLATE_STYLES = [
  { label: 'Classic', value: 'classic' },
  { label: 'Modern', value: 'modern' },
  { label: 'Minimal', value: 'minimal' },
];

const ACCENT_COLORS = [
  { label: 'Blue', value: '#2980b9' },
  { label: 'Green', value: '#27ae60' },
  { label: 'Purple', value: '#8e44ad' },
  { label: 'Red', value: '#c0392b' },
  { label: 'Orange', value: '#d35400' },
];

export default function CertificateForm() {
  const addCertificate = useCertificateStore((state) => state.addCertificate);
  const setCurrentCertificate = useCertificateStore(
    (state) => state.setCurrentCertificate
  );

  const [formData, setFormData] = useState<FormData>({
    recipientName: '',
    courseName: '',
    completionDate: new Date().toISOString().split('T')[0],
    issuerName: '',
    issuerTitle: '',
    grade: '',
    duration: '',
    description: '',
    achievements: [''],
    templateStyle: 'classic',
    accentColor: '#2980b9',
  });

  const [newAchievement, setNewAchievement] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setFormData({ ...formData, logo: result.assets[0].uri });
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()],
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchievements });
  };

  const handleSubmit = () => {
    const certificate = {
      ...formData,
      certificateNumber: `CERT-${Date.now()}`,
    };

    addCertificate(certificate);
    
    // Reset form
    setFormData({
      recipientName: '',
      courseName: '',
      completionDate: new Date().toISOString().split('T')[0],
      issuerName: '',
      issuerTitle: '',
      grade: '',
      duration: '',
      description: '',
      achievements: [''],
      templateStyle: 'classic',
      accentColor: '#2980b9',
    });

    // Navigate back to certificates list
    router.push('/certificates');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <TextInput
          label="Recipient Name"
          value={formData.recipientName}
          onChangeText={(text) => setFormData({ ...formData, recipientName: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Course Name"
          value={formData.courseName}
          onChangeText={(text) => setFormData({ ...formData, courseName: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Completion Date"
          value={formData.completionDate}
          onChangeText={(text) => setFormData({ ...formData, completionDate: text })}
          style={styles.input}
          mode="outlined"
        />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Issuer Name"
          value={formData.issuerName}
          onChangeText={(text) => setFormData({ ...formData, issuerName: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Issuer Title"
          value={formData.issuerTitle}
          onChangeText={(text) => setFormData({ ...formData, issuerTitle: text })}
          style={styles.input}
          mode="outlined"
        />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Grade (Optional)"
          value={formData.grade}
          onChangeText={(text) => setFormData({ ...formData, grade: text })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Duration"
          value={formData.duration}
          onChangeText={(text) => setFormData({ ...formData, duration: text })}
          style={styles.input}
          mode="outlined"
          placeholder="e.g., 6 months, 40 hours"
        />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Add Achievement"
          value={newAchievement}
          onChangeText={setNewAchievement}
          style={styles.input}
          mode="outlined"
          right={
            <TextInput.Icon
              icon="plus"
              onPress={addAchievement}
            />
          }
        />
        <View style={styles.achievementList}>
          {formData.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.achievementText}>{achievement}</Text>
              {index > 0 && (
                <Button
                  onPress={() => removeAchievement(index)}
                  mode="text"
                  icon="delete"
                >
                  Remove
                </Button>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Button
          mode="outlined"
          onPress={pickImage}
          style={styles.button}
          icon="image"
        >
          {formData.logo ? 'Change Logo' : 'Add Logo'}
        </Button>
      </View>

      <View style={styles.section}>
        <SegmentedButtons
          value={formData.templateStyle}
          onValueChange={(value) =>
            setFormData({ ...formData, templateStyle: value as 'classic' | 'modern' | 'minimal' })
          }
          buttons={TEMPLATE_STYLES}
        />
      </View>

      <View style={styles.section}>
        <SegmentedButtons
          value={formData.accentColor}
          onValueChange={(value) => setFormData({ ...formData, accentColor: value })}
          buttons={ACCENT_COLORS}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={!formData.recipientName || !formData.courseName}
      >
        Generate Certificate
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  achievementItem: {
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 16,
    marginBottom: 5,
  },
  achievementList: {
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});
