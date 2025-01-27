/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/order
import { Dimensions, Image, StyleSheet, View, Platform } from 'react-native';
/* eslint-disable import/order */
import React, { useRef } from 'react';

import CertificateActions from './CertificateActions';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native-paper';
import ViewShot from 'react-native-view-shot';
import { useCertificateStore } from '../store/store';

const { width } = Dimensions.get('window');
const CERTIFICATE_WIDTH = Math.min(width - 40, 600);

const getTemplateStyles = (templateStyle: string, accentColor: string) => {
  const baseStyles = {
    classic: {
      container: {
        borderWidth: 3,
        borderColor: accentColor,
      },
      gradientColors: [
        `${accentColor}10`,
        'white',
        'white',
        `${accentColor}10`,
      ],
      header: {
        fontSize: 32,
        color: accentColor,
      },
      name: {
        fontSize: 36,
        color: accentColor,
      },
    },
    modern: {
      container: {
        borderRadius: 15,
      },
      gradientColors: [
        accentColor,
        `${accentColor}10`,
        'white',
        'white',
      ],
      header: {
        fontSize: 34,
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      },
      name: {
        fontSize: 38,
        color: accentColor,
      },
    },
    minimal: {
      container: {
        borderBottomWidth: 4,
        borderBottomColor: accentColor,
      },
      gradientColors: [
        'white',
        `${accentColor}05`,
        `${accentColor}10`,
      ],
      header: {
        fontSize: 32,
        color: accentColor,
      },
      name: {
        fontSize: 36,
        color: accentColor,
      },
    },
  };

  return baseStyles[templateStyle as keyof typeof baseStyles] || baseStyles.classic;
};

interface Certificate {
  id: string;
  recipientName: string;
  courseName: string;
  completionDate: string;
  duration: string;
  grade?: string;  // Made optional to match store definition
  issuerName: string;
  issuerTitle: string;
  templateStyle?: string;
  accentColor?: string;
  logo?: string;
  description?: string;
  achievements?: string[];
  certificateNumber: string;
}

interface CertificatePreviewProps {
  certificate: Certificate;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ certificate }) => {
  const certificateRef = useRef<ViewShot>(null);

  if (!certificate) {
    return null;
  }

  const templateStyles = getTemplateStyles(
    certificate.templateStyle,
    certificate.accentColor
  );

  return (
    <View style={styles.container}>
      <ViewShot
        ref={certificateRef}
        options={{
          format: 'png',
          quality: 1,
          result: Platform.OS === 'web' ? 'base64' : 'tmpfile',
        }}
        style={styles.viewShot}
      >
        <View style={[styles.certificate, templateStyles.container]}>
          <LinearGradient
            colors={templateStyles.gradientColors}
            style={styles.gradient}
          />
          
          <View style={styles.watermarkContainer}>
            <Text style={[styles.watermark, { color: `${certificate.accentColor}10` }]}>
              CERTIFICATE
            </Text>
          </View>

          {certificate.logo && (
            <Image
              source={{ uri: certificate.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          
          <Text style={[styles.header, templateStyles.header]}>
            Certificate of Completion
          </Text>
          
          <Text style={styles.subHeader}>This is to certify that</Text>
          
          <Text style={[styles.name, templateStyles.name]}>
            {certificate.recipientName}
          </Text>
          
          <Text style={styles.text}>
            has successfully completed the course
          </Text>
          
          <Text style={[styles.courseName, { color: certificate.accentColor }]}>
            {certificate.courseName}
          </Text>

          {certificate.description && (
            <Text style={styles.description}>
              {certificate.description}
            </Text>
          )}

          {certificate.achievements && certificate.achievements.length > 0 && (
            <View style={styles.achievementsContainer}>
              <Text style={styles.achievementsHeader}>Achievements:</Text>
              {certificate.achievements.map((achievement, index) => (
                achievement && (
                  <Text key={index} style={styles.achievement}>
                    • {achievement}
                  </Text>
                )
              ))}
            </View>
          )}

          {certificate.grade && (
            <Text style={styles.grade}>
              Grade: {certificate.grade}
            </Text>
          )}

          <Text style={styles.duration}>
            Duration: {certificate.duration}
          </Text>

          <Text style={styles.date}>
            Completed on {new Date(certificate.completionDate).toLocaleDateString()}
          </Text>

          <View style={styles.footer}>
            <View style={styles.signatureContainer}>
              <View style={[styles.signatureLine, { backgroundColor: certificate.accentColor }]} />
              <Text style={styles.issuerName}>
                {certificate.issuerName}
              </Text>
              <Text style={styles.issuerTitle}>
                {certificate.issuerTitle}
              </Text>
            </View>
            
            <Text style={styles.certificateNumber}>
              Certificate Number: {certificate.certificateNumber}
            </Text>
          </View>
        </View>
      </ViewShot>

      <CertificateActions
        certificate={certificate}
        certificateRef={certificateRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  viewShot: {
    width: CERTIFICATE_WIDTH,
  },
  certificate: {
    width: CERTIFICATE_WIDTH,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    }),
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  watermarkContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-30deg' }],
    pointerEvents: 'none',
  },
  watermark: {
    fontSize: 80,
    fontWeight: 'bold',
    opacity: 0.1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 15,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    marginVertical: 8,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  courseName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  achievementsContainer: {
    alignSelf: 'stretch',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  achievementsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  achievement: {
    fontSize: 16,
    color: '#666',
    marginVertical: 3,
  },
  grade: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  duration: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  date: {
    fontSize: 16,
    marginTop: 25,
    color: '#7f8c8d',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  signatureContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '60%',
  },
  signatureLine: {
    width: '100%',
    height: 2,
    marginBottom: 10,
  },
  issuerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  issuerTitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  certificateNumber: {
    fontSize: 14,
    marginTop: 15,
    color: '#95a5a6',
  },
});

export default CertificatePreview;
