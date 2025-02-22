import * as Print from 'expo-print';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRef, useState } from 'react';

import { CaptureOptions } from 'react-native-view-shot'; // Re-import if needed
import React from 'react';
import { Resume } from '../store/resumeStore';
import { Text } from 'react-native-paper';
import ViewShot from 'react-native-view-shot'; // Ensure you import ViewShot
import { exportDocument } from '../utils/documentExport';
import { loadOptions } from '@babel/core';

// Use CaptureOptions in your props or function definitions
type ResumeTemplateProps = {
  resume: Resume;
  options: CaptureOptions; // Example usage
};
export default function ResumeTemplate({ resume }: ResumeTemplateProps) {
  
const certificateRef = useRef(null);
const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; text-align: center; }
            h2 { color: #2196F3; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px; }
            p, li { font-size: 14px; line-height: 1.5; color: #444; }
            .section { margin-bottom: 20px; }
            .item { margin-bottom: 15px; }
            .contact { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${resume.firstName} ${resume.lastName}</h1>
          <p class="contact">${resume.email} | ${resume.phone} | ${resume.address}, ${resume.city}, ${resume.state} ${resume.postalCode}, ${resume.country}</p>

          ${resume.profileSummary ? `<div class="section"><h2>Professional Summary</h2><p>${resume.profileSummary}</p></div>` : ''}

          ${resume.education?.length > 0 ? `
            <div class="section">
              <h2>Education</h2>
              ${resume.education.map(edu => `
                <div class="item">
                  <h3>${edu.institution}</h3>
                  <p>${edu.degree} in ${edu.field} (${edu.startDate} - ${edu.endDate})</p>
                  <p>${edu.description || ''}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resume.workExperience?.length > 0 ? `
            <div class="section">
              <h2>Work Experience</h2>
              ${resume.workExperience.map(exp => `
                <div class="item">
                  <h3>${exp.company} (${exp.startDate} - ${exp.endDate})</h3>
                  <p>${exp.position}</p>
                  <p>${exp.description || ''}</p>
                  ${exp.achievements?.length ? `<ul>${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}</ul>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resume.skills?.length > 0 ? `
            <div class="section">
              <h2>Skills</h2>
              <ul>${resume.skills.map(skill => `<li>${skill.name} (${skill.level})</li>`).join('')}</ul>
            </div>
          ` : ''}

          ${resume.languages?.length > 0 ? `
            <div class="section">
              <h2>Languages</h2>
              <ul>${resume.languages.map(lang => `<li>${lang.language} - ${lang.proficiency}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Resume Content */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.firstName} {resume.lastName}</Text>
        <Text style={styles.jobTitle}>{resume.jobTitle}</Text>
        <Text style={styles.contactText}>{resume.email} | {resume.phone}</Text>
      </View>

      {/* Download & Capture Options */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
          <Text style={styles.downloadButtonText}>Download PDF</Text>
        </TouchableOpacity>
        <ViewShot ref={certificateRef}>
       <CaptureOptions resume={resume} certificateRef={certificateRef} setIsLoading={setIsLoading} />
      </ViewShot>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: 20,
    color: '#771313',
  },
  contactText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  actions: {
    marginTop: 20,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

