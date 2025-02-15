/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import ViewShot, { captureRef } from 'react-native-view-shot';

import { Button } from 'react-native-paper';
import { Certificate } from '../store/store';

const captureOptions: {
    format: "jpg" | "png" | "jpeg" | "webm" | "raw" | undefined;
    quality: number;
    result: string;
} = {
    format: "pdf",
    quality: 1,
    result: "tmpfile",
    
    
};
interface CertificateActionsProps {
  certificate: Certificate;
  certificateRef: React.RefObject<ViewShot>;
}

type CaptureOptions = {
    format: "jpg" | "png" | "jpeg" | "webm" | "raw" | undefined;
    quality: number;
    result: string;
};

export default function CertificateActions({ certificate, certificateRef }: CertificateActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileFormat, setFileFormat] = useState<'png' | 'jpeg'>('jpeg'); // Default format is JPEG

  const generateFileName = () => {
    const timestamp = new Date().getTime();
    const sanitizedName = certificate.recipientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `certificate_${sanitizedName}_${timestamp}.${fileFormat}`;
  };
  const validFormats: ("jpg" | "png" | "jpeg")[] = ['png', 'jpg', 'jpeg'];

  const captureCertificate = async (): Promise<string | null> => {
    try {
      if (!certificateRef.current) {
        throw new Error('Certificate reference not found');
      }

      const validFormats: ("png" | "jpeg" | "jpg")[] = ['png', 'jpeg', 'jpg'];
      const fileFormatToUse = validFormats.includes(fileFormat) ? fileFormat : 'png';
      const options: CaptureOptions = {
        format: 'jpg', 
        quality: 0.8,
        result: (Platform.OS === 'web' || Platform.OS === 'android') ? 'base64' : 'tmpfile', // Default to 'tmpfile'
      };

      const result = await captureRef(certificateRef.current, options as CaptureOptions);

      if (Platform.OS === 'web') {
        return `data:image/${fileFormatToUse};base64,${result}`;
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error capturing certificate:', error);
      } else {
        console.error('An unknown error occurred');
      }
      throw error;
    }
  };

  const saveToGallery = async () => {
    if (Platform.OS === 'web' || Platform.OS === 'android') {
      try {
        const imageUri = await captureCertificate();
        if (!imageUri) {
          throw new Error('Failed to capture certificate');
        }

        const link = document.createElement('a');
        link.href = imageUri;
        link.download = generateFileName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error saving on web:', error);
          Alert.alert('Error', `Failed to save certificate: ${error.message}`);
        } else {
          console.error('An unknown error occurred');
          Alert.alert('Error', 'Failed to save certificate: An unknown error occurred.');
        }
      }
      return;
    }

    try {
      setIsLoading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save certificates to your gallery'
        );
        return;
      }

      const imageUri = await captureCertificate();
      if (!imageUri) {
        throw new Error('Failed to capture certificate');
      }

      const asset = await MediaLibrary.createAssetAsync(imageUri);
      const album = await MediaLibrary.getAlbumAsync('Certificates');

      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Certificates', asset, false);
      }

      Alert.alert('Success', `Certificate saved to your gallery in ${fileFormat.toUpperCase()} format`);
      Sharing.shareAsync(imageUri, { dialogTitle: 'Share Certificate' });
      setIsLoading(false);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error saving to gallery:', error);
        Alert.alert('Error', `Failed to save certificate: ${error.message}`);
      } else {
        console.error('An unknown error occurred');
        Alert.alert('Error', 'Failed to save certificate: An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shareCertificate = async () => {
    try {
      setIsLoading(true);

      const imageUri = await captureCertificate();
      if (!imageUri) {
        throw new Error('Failed to capture certificate');
      }

      if (Platform.OS === 'web' || Platform.OS === 'android') {
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = generateFileName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      const mimeType = `image/${fileFormat}`;
      await Sharing.shareAsync(imageUri, {
        mimeType,
        dialogTitle: `Share Certificate as ${fileFormat.toUpperCase()}`,
        UTI: `public.${fileFormat}`
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sharing certificate:', error);
        Alert.alert('Error', `Failed to share certificate: ${error.message}`);
      } else {
        console.error('An unknown error occurred');
        Alert.alert('Error', 'Failed to share certificate: An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formatSelector}>
        {['png', 'jpeg'].map((format) => (
          <Button
            key={format}
            mode={fileFormat === format ? 'contained' : 'outlined'}
            onPress={() => setFileFormat(format as 'png' | 'jpeg')}
          >
            {format.toUpperCase()}
          </Button>
        ))}
      </View>
      <Button
        mode="contained"
        icon="content-save"
        onPress={saveToGallery}
        style={styles.button}
      >
        {Platform.OS === 'web' ? 'Download' : `Save as ${fileFormat.toUpperCase()}`}
      </Button>
      <Button
        mode="contained"
        icon="share-variant"
        onPress={shareCertificate}
        style={styles.button}
      >
        Share
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 20,
    gap: 10,
  },
  button: {
    minWidth: 150,
    marginTop: 10,
  },
  formatSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
