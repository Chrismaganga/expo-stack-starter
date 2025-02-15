/* eslint-disable import/order */
import { StyleSheet, View } from 'react-native';

/* eslint-disable prettier/prettier */
import React from 'react';
import { Resume } from '../store/resumeStore';
import { Text } from 'react-native-paper';

interface ResumeTemplateProps {
  resume: Resume;
}

export default function ResumeTemplate({ resume }: ResumeTemplateProps) {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.firstName} {resume.lastName}</Text>
        <Text style={styles.jobTitle}>{resume.jobTitle}</Text>
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>{resume.email}</Text>
          <Text style={styles.contactText}>{resume.phone}</Text>
          <Text style={styles.contactText}>
            {resume.address}, {resume.city}, {resume.country}
            {resume.postalCode}
            {resume.state}
            
          </Text>
        </View>
      </View>

      {/* Profile Summary */}
      {resume.profileSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.text}>{resume.profileSummary}</Text>
        </View>
      )}

      {/* Education Section */}
      {resume.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resume.education.map((edu) => (
            <View key={edu.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.institution}</Text>
                <Text style={styles.dates}>{edu.startDate} - {edu.endDate}</Text>
              </View>
              <Text style={styles.subtitle}>{edu.degree} in {edu.field}</Text>
              {edu.description && (
                <Text style={styles.text}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Work Experience Section */}
      {resume.workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resume.workExperience.map((exp) => (
            <View key={exp.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.company}</Text>
                <Text style={styles.dates}>{exp.startDate} - {exp.endDate}</Text>
              </View>
              <Text style={styles.subtitle}>{exp.position}</Text>
              <Text style={styles.text}>{exp.description}</Text>
              {exp.achievements.length > 0 && (
                <View style={styles.achievements}>
                  {exp.achievements.map((achievement, index) => (
                    <Text key={index} style={styles.achievement}>
                      • {achievement}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {resume.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsGrid}>
            {resume.skills.map((skill) => (
              <View key={skill.id} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>{skill.level}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Languages Section */}
      {resume.languages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languagesGrid}>
            {resume.languages.map((lang, index) => (
              <Text key={index} style={styles.language}>
                {lang.language} - {lang.proficiency}
              </Text>
            ))}
          </View>
          <View style={styles.actions}>
            <View style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </View>
            <CaptureOptions />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 20,
    color: '#771313',
    marginBottom: 12,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: 'cyan',
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 4,
  },
  item: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 14,
    color: '#721919',
  },
  subtitle: {
    fontSize: 15,
    color: '#490505',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#080750',
    lineHeight: 20,
  },
  achievements: {
    marginTop: 8,
  },
  achievement: {
    fontSize: 14,
    color: '#490707',
    marginBottom: 2,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillItem: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  skillLevel: {
    fontSize: 12,
    color: '#078611',
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  language: {
    fontSize: 14,
    color: '#0b7e11',
  },
});
