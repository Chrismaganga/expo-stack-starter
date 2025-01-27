/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { v4 as uuidv4 } from 'uuid';

interface EducationFormModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (education: any) => void;
  initialData?: any;
}

export default function EducationFormModal({
  visible,
  onDismiss,
  onSave,
  initialData,
}: EducationFormModalProps) {
  const [formData, setFormData] = useState(
    initialData || {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    }
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text variant="titleLarge" style={styles.title}>
          Add Education
        </Text>
        <ScrollView style={styles.form}>
          <TextInput
            label="Institution"
            value={formData.institution}
            onChangeText={(value) => handleChange('institution', value)}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Degree"
            value={formData.degree}
            onChangeText={(value) => handleChange('degree', value)}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Field of Study"
            value={formData.field}
            onChangeText={(value) => handleChange('field', value)}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Start Date"
            value={formData.startDate}
            onChangeText={(value) => handleChange('startDate', value)}
            mode="outlined"
            style={styles.input}
            placeholder="MM/YYYY"
          />
          
          <TextInput
            label="End Date"
            value={formData.endDate}
            onChangeText={(value) => handleChange('endDate', value)}
            mode="outlined"
            style={styles.input}
            placeholder="MM/YYYY or Present"
          />
          
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={4}
          />
        </ScrollView>
        
        <View style={styles.actions}>
          <Button onPress={onDismiss} style={styles.button}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});
