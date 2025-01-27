import { Stack } from 'expo-router';

export default function CertificatesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Certificates',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Certificate',
        }}
      />
    </Stack>
  );
}
