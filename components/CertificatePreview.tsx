/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
import React, { useRef } from 'react';

import { Certificate } from '../store/store';
import CertificateActions from './CertificateActions';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native-paper';
import ViewShot from 'react-native-view-shot';

// Ensure this is correctly defined in store

/* eslint-disable import/order */

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
        `rgba(${accentColor}, 0.1)`, // Ensure valid RGBA format
        'white',
        'white',
        `rgba(${accentColor}, 0.1)`,
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
      gradientColors: [accentColor, `rgba(${accentColor}, 0.1)`, 'white', 'white'],
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
      gradientColors: ['white', `rgba(${accentColor}, 0.05)`, `rgba(${accentColor}, 0.1)`],
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

interface CertificatePreviewProps {
  certificate: Certificate;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ certificate }) => {
  const certificateRef = useRef<ViewShot>(null);

  if (!certificate) {
    return null;
  }

  const templateStyles = getTemplateStyles(
    certificate.templateStyle ?? 'classic',
    certificate.accentColor ?? '#000000'
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
          <LinearGradient//-
            colors={templateStyles.gradientColors}
            style={styles.gradient}//-
          />
          <View style={styles.watermarkContainer}>//-
            <Text style={[styles.watermark, { color: `rgba(${certificate.accentColor}, 0.1)` }]}>//-
              CERTIFICATE//-
            </Text>//-
          </View>//-

          {certificate.logo && (
            <Image//-
              source={{ uri: certificate.logo }}//-
              style={styles.logo}//-
              resizeMode="contain"//-
            />//-
          )}//-

          <Text style={[styles.header, templateStyles.header]}>//-
            Certificate of Completion//-
          </Text>//-

          <Text style={styles.subHeader}>This is to certify that</Text>//-
      <Text style={[styles.name, templateStyles.name]}>//-
            {certificate.recipientName}//-
          </Text>//-

          <Text style={styles.text}>//-
            has successfully completed the course//-
          </Text>//-
//-
          <Text style={[styles.courseName, { color: certificate.accentColor }]}>//-
            {certificate.courseName}//-
          </Text>//-
//-
          <Text style={styles.description}>//-
            {certificate.description}//-
          </Text>//-
//-
          {certificate.achievements?.length > 0 && (//-
            <View style={styles.achievementsContainer}>//-
              <Text style={styles.achievementsHeader}>Achievements:</Text>//-
              {certificate.achievements.map((achievement, index) => (//-
                achievement && (//-
                  <Text key={index} style={styles.achievement}>//-
                    • {achievement}//-
                  </Text>//-
                )//-
              ))}//-
            </View>//-
          )}//-
//-
          {certificate.grade && (//-
            <Text style={styles.grade}>//-
              Grade: {certificate.grade}//-
            </Text>//-
          )}//-
//-
          <Text style={styles.duration}>//-
            Duration: {certificate.duration}//-
          </Text>//-
//-
          <Text style={styles.date}>//-
            Completed on {new Date(certificate.completionDate).toLocaleDateString()}//-
          </Text>//-
//-
          <View style={styles.footer}>//-
            <View style={styles.signatureContainer}>//-
              <View style={[styles.signatureLine, { backgroundColor: certificate.accentColor }]} />//-
              <Text style={styles.issuerName}>//-
                {certificate.issuerName}//-
              </Text>//-
              <Text style={styles.issuerTitle}>//-
                {certificate.issuerTitle}//-
              </Text>//-
            </View>//-
//-
            <Text style={styles.certificateNumber}>//-
              Certificate Number: {certificate.certificateNumber}//-
            </Text>//-
          </View>//-
        </View>//-
"conversationId":"f4bdca05-ecd1-479a-b8f1-bbc2eab30669","source":"instruct"}
      </ViewShot>

      <CertificateActions
        certificate={certificate}
        certificateRef={certificateRef}
      />
    </View>
  );
};

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
    ...(Platform.OS !== 'web'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        }
      : {}),
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
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CertificatePreview;
