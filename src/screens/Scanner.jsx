import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../styles/theme";

export default function Scanner({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Precisamos de permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    // 'data' será o código da vaga (ex: "A-01")
    navigation.navigate("Checkin", { qrCodeVaga: data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
         <View style={styles.unfocusedContainer}></View>
         <View style={styles.focusedContainer}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
         </View>
         <View style={styles.unfocusedContainer}>
            <Text style={styles.scanText}>Aponte para o QR Code da Vaga</Text>
         </View>
      </View>

      {scanned && (
        <TouchableOpacity style={globalStyles.button} onPress={() => setScanned(false)}>
            <Text style={globalStyles.buttonText}>Escanear Novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  focusedContainer: { width: 250, height: 250, borderWidth: 0, position: 'relative' },
  scanText: { color: '#fff', marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  // Estilização das bordinhas do scanner
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderLeftWidth: 4, borderTopWidth: 4, borderColor: colors.primary },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderRightWidth: 4, borderTopWidth: 4, borderColor: colors.primary },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderLeftWidth: 4, borderBottomWidth: 4, borderColor: colors.primary },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderRightWidth: 4, borderBottomWidth: 4, borderColor: colors.primary },
});