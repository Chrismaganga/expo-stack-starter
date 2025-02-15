/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CertificateActions from '../../components/CertificateActions';
import CertificatePreview from '../../components/CertificatePreview';
import { Text } from 'react-native-paper';
import ViewShot from 'react-native-view-shot';
import { useCertificateStore } from '../../store/store';

class Certificate {
  fields: {
    id: string;
    recipientName: string;
    courseName: string;
    completionDate: string;
    certificateNumber: string;
    certificateUrl: string;
    certificateId: string;
    certificate: string;
    issuer: string;
    issuerName: string;
    issuerTitle: string;
    issuerSignature?: string;
    grade?: string;
    duration: string;
    description: string;
    achievements: string[];
    logo?: string;
    templateStyle: 'classic' | 'modern' | 'minimal';
    accentColor: string;
    createdAt: string;
  };
}

export default function CertificatesScreen() {
  const certificates = useCertificateStore((state) => state.certificates);
  const setCurrentCertificate = useCertificateStore(
    (state) => state.setCurrentCertificate
  );
  const certificateRef = useRef<ViewShot>(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Certificates</Text>
      
      {certificates.length === 0 ? (
        <Text style={styles.emptyText}>
          No certificates yet. Create your first certificate to see it here!
        </Text>
      ) : (
        certificates.map((certificate) => (
          <View key={certificate.id} style={styles.certificateContainer}>
            <ViewShot
              ref={certificateRef}
              options={{
                format: 'png',
                quality: 1,
                result: 'tmpfile',
              }}
            >
              <View style={styles.certificateWrapper}>
                <CertificatePreview />
              </View>
            </ViewShot>
            
            <CertificateActions
              certificate={certificate}
              certificateRef={certificateRef}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
  },
  certificateContainer: {
    marginBottom: 30,
  },
  certificateWrapper: {
    marginBottom: 10,
  },
});
