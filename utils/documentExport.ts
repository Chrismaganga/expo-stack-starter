import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
// eslint-disable-next-line import/order
import * as Sharing from 'expo-sharing';

/* eslint-disable import/no-duplicates */
import { Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';

// Define document types
export type DocumentType = 'resume' | 'cover-letter' | 'certificate';

interface ExportOptions {
  viewShotRef: React.RefObject<ViewShot>;
  documentType: DocumentType;
  fileName: string;
}

export const exportDocument = async ({ viewShotRef, documentType, fileName }: ExportOptions) => {
  if (!viewShotRef.current) {
    throw new Error('ViewShot reference is not available');
  }

  try {
    // Ensure base directories exist
    const documentsDir = FileSystem.documentDirectory + 'documents';
    const categoryDir = `${documentsDir}/${documentType}s`;

    const docDirInfo = await FileSystem.getInfoAsync(documentsDir);
    if (!docDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
    }

    const catDirInfo = await FileSystem.getInfoAsync(categoryDir);
    if (!catDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(categoryDir, { intermediates: true });
    }

    // Sanitize filename and add timestamp
    const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFileName = `${sanitizedFileName}_${timestamp}`;

    // Capture high quality PNG first (this will be converted to PDF)
    const pngUri = await captureRef(viewShotRef, {
      format: 'png',
      quality: 1,
      result: 'data-uri',
    });

    // Create PDF with proper page setup
    const pdfPath = `${categoryDir}/${baseFileName}.pdf`;
    const { uri: pdfUri } = await Print.printToFileAsync({
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${fileName}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                height: auto;
                page-break-inside: avoid;
              }
              @page {
                margin: 0.5cm;
                size: A4;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <img src="${pngUri}" />
          </body>
        </html>
      `,
      width: 595.28, // A4 width in points (72 dpi)
      // eslint-disable-next-line prettier/prettier
      height: 841.89 // A4 height in points (72 dpi)
    });

    // Move PDF to final location
    await FileSystem.moveAsync({
      from: pdfUri,
      to: pdfPath,
    });

    // Share PDF
    if (Platform.OS !== 'web') {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(pdfPath, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${documentType} PDF`,
          UTI: 'com.adobe.pdf',
        });
      }
    }

    return {
      pdfPath,
    };
  } catch (error) {
    console.error('Error exporting document:', error);
    throw error;
  }
};

export const getDocumentDirectory = async (documentType: DocumentType) => {
  const categoryDir = FileSystem.documentDirectory + `documents/${documentType}s`;
  const exists = await FileSystem.getInfoAsync(categoryDir);

  if (!exists.exists) {
    await FileSystem.makeDirectoryAsync(categoryDir, { intermediates: true });
  }

  return categoryDir;
};

export const listDocuments = async (documentType: DocumentType) => {
  const directory = await getDocumentDirectory(documentType);
  const files = await FileSystem.readDirectoryAsync(directory);
  // eslint-disable-next-line prettier/prettier
  
  const results = await Promise.all(
    files.map(async (file) => {
      const path = `${directory}/${file}`;
      const info = await FileSystem.getInfoAsync(path);
      if (!info.exists) {
        return null;
      }
      return {
        name: file,
        path,
        size: info.size,
        modifiedTime: info.modificationTime,
        type: 'pdf',
      };
    })
  );

  return {
    pdfs: results.filter((f): f is NonNullable<typeof f> => f !== null && f.type === 'pdf'),
  };
};
