import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { Platform } from 'react-native';
import { Resume } from '../store/resumeStore';

export const exportResumeAsPDF = async (
  viewShotRef: React.RefObject<ViewShot>,
  resume: Resume
) => {
  try {
    // Create resumes directory if it doesn't exist
    const resumesDir = `${FileSystem.documentDirectory}resumes`;
    const dirInfo = await FileSystem.getInfoAsync(resumesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(resumesDir, { intermediates: true });
    }

    // Generate filename
    const timestamp = new Date().getTime();
    const fileName = `${resume.firstName}_${resume.lastName}_Resume_${timestamp}`;
    
    // Capture view as image
    const uri = await viewShotRef.current?.capture?.();
    if (!uri) throw new Error('Failed to capture resume view');

    // Save image to file
    const imagePath = `${resumesDir}/${fileName}.png`;
    await FileSystem.moveAsync({
      from: uri,
      to: imagePath
    });

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(imagePath, {
        mimeType: 'image/png',
        dialogTitle: 'Export Resume',
        UTI: 'public.png'
      });
    }

    return imagePath;
  } catch (error) {
    console.error('Error exporting resume:', error);
    throw error;
  }
};

export const getResumesDirectory = async () => {
  const resumesDir = `${FileSystem.documentDirectory}resumes`;
  const dirInfo = await FileSystem.getInfoAsync(resumesDir);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(resumesDir, { intermediates: true });
  }
  
  return resumesDir;
};

export const listSavedResumes = async () => {
  const resumesDir = await getResumesDirectory();
  const files = await FileSystem.readDirectoryAsync(resumesDir);
  return files;
};
