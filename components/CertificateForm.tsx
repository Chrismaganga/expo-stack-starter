/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import * as ImagePicker from 'expo-image-picker';

import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { Certificate } from '../store/store';
import { useCertificateStore } from '../store/store';
import { v4 as uuidv4 } from 'uuid';

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
  { label: 'Blue', value: '#053a5e' },
  { label: 'Green', value: '#27ae60' },
  { label: 'Purple', value: '#8e44ad' },
  { label: 'Red', value: '#c0392b' },
  { label: 'Orange', value: '#d35400' },
  { label: 'Yellow', value: '#f1c40f' },
  { label: 'Gray', value: '#7f8c8d' },
  { label: 'Black', value: '#2c3e50' },
  { label: 'White', value: '#ffffff' },
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const certificate: Certificate = {
      id: uuidv4(),
      recipientName: formData.recipientName,
      courseName: formData.courseName,
      completionDate: formData.completionDate,
      certificateNumber: `CERT-${Date.now()}`,
      issuerName: formData.issuerName,
      issuerTitle: formData.issuerTitle,
      grade: formData.grade,
      duration: formData.duration,
      description: formData.description,
      achievements: formData.achievements,
      logo: formData.logo,
      templateStyle: formData.templateStyle,
      accentColor: formData.accentColor,
      createdAt: '',
      certificateUrl: '',
      certificateId: '',
      certificate: '',
      issuer: ''
    };

    addCertificate(certificate);
    setCurrentCertificate(certificate);
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
        {formData.achievements.map((achievement, index) => (
          achievement && (
            <View key={index} style={styles.achievementItem}>
              <TextInput
                value={achievement}
                onChangeText={(text) => {
                  const newAchievements = [...formData.achievements];
                  newAchievements[index] = text;
                  setFormData({ ...formData, achievements: newAchievements });
                }}
                style={styles.achievementInput}
                mode="outlined"
                dense
                right={
                  <TextInput.Icon
                    icon="close"
                    onPress={() => removeAchievement(index)}
                  />
                }
              />
            </View>
          )
        ))}
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
  achievementInput: {
    flex: 1,
  },
  button: {
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});
