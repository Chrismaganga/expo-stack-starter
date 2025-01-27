/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
/* eslint-disable import/order */
import React, { useState } from 'react';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import ViewShot, { captureRef } from 'react-native-view-shot';

import { Button } from 'react-native-paper';
import { Certificate } from '../store/store';

interface CertificateActionsProps {
  certificate: Certificate;
  certificateRef: React.RefObject<ViewShot>;
}

export default function CertificateActions({ certificate, certificateRef }: CertificateActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generateFileName = () => {
    const timestamp = new Date().getTime();
    const sanitizedName = certificate.recipientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `certificate_${sanitizedName}_${timestamp}`;
  };

  const captureCertificate = async (): Promise<string | null> => {
    try {
      if (!certificateRef.current) {
        throw new Error('Certificate reference not found');
      }

      // Capture options specific to platform
      const captureOptions = Platform.OS === 'web' 
        ? { format: 'png' as const, quality: 0.8, result: 'base64' as const }
        : { format: 'png' as const, quality: 0.8 };

      // Capture the certificate view
      const result = await captureRef(certificateRef.current, captureOptions);
      
      if (Platform.OS === 'web') {
        return `data:image/png;base64,${result}`;
      }

      try {
        // For native platforms, optimize the image
        const optimizedImage = await manipulateAsync(
          result,
          [{ resize: { width: 1920 } }],
          { compress: 0.8, format: SaveFormat.PNG }
        );

        // Clean up the original capture file if it exists
        if (result.startsWith(FileSystem.cacheDirectory || '')) {
          try {
            await FileSystem.deleteAsync(result, { idempotent: true });
          } catch (cleanupError) {
            console.warn('Failed to cleanup original capture:', cleanupError);
          }
        }

        return optimizedImage.uri;
      } catch (manipulationError) {
        console.error('Image manipulation failed:', manipulationError);
        // If optimization fails, return the original URI as fallback
        return result;
      }
    } catch (error) {
      console.error('Error capturing certificate:', error);
      throw error;
    }
  };

  const saveToGallery = async () => {
    if (Platform.OS === 'web') {
      try {
        const imageUri = await captureCertificate();
        if (!imageUri) {
          throw new Error('Failed to capture certificate');
        }

        // For web, create a download link
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `${generateFileName()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error saving on web:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        Alert.alert('Error', `Failed to save certificate: ${errorMessage}`);
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

      Alert.alert(
        'Success',
        'Certificate saved to your gallery in the "Certificates" album'
      );
    } catch (error) {
      console.error('Error saving to gallery:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert(
        'Error',
        `Failed to save certificate to gallery: ${errorMessage}`
      );
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

      if (Platform.OS === 'web') {
        // For web, create a download link
        const link = document.createElement('a');
        link.href = imageUri;
        link.download = `${generateFileName()}.png`;
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

      await Sharing.shareAsync(imageUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Certificate',
        UTI: 'public.png'
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert(
        'Error',
        `Failed to share certificate: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      setIsLoading(true);
      const imageData = await captureCertificate();
      
      if (!imageData) {
        throw new Error('Failed to capture certificate');
      }

      if (Platform.OS === 'web') {
        try {
          // Extract clean base64 data
          const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
          
          // Convert base64 to binary string
          const binaryStr = atob(base64Data);
          
          // Convert binary string to Uint8Array
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          
          // Create blob with proper type
          const blob = new Blob([bytes], { type: 'image/png' });
          
          // Create download URL
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${generateFileName()}.png`;
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (webError) {
          console.error('Web download error:', webError);
          const errorMessage = webError instanceof Error ? webError.message : 'An unknown error occurred';
          throw new Error(`Web download failed: ${errorMessage}`);
        }
      } else {
        const filePath = `${FileSystem.cacheDirectory}${generateFileName()}.png`;
        await FileSystem.writeAsStringAsync(filePath, imageData, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(filePath);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Error', `Failed to download certificate: ${errorMessage}`);
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
      <Button
        mode="contained"
        icon="content-save"
        onPress={saveToGallery}
        style={styles.button}
      >
        {Platform.OS === 'web' ? 'Download' : 'Save to Gallery'}
      </Button>
      
      {Platform.OS !== 'web' && (
        <Button
          mode="contained"
          icon="share-variant"
          onPress={shareCertificate}
          style={styles.button}
        >
          Share
        </Button>
      )}
      
      {Platform.OS !== 'web' && (
        <Button
          mode="contained"
          icon="download"
          onPress={downloadCertificate}
          style={styles.button}
        >
          Download
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    minWidth: 150,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
