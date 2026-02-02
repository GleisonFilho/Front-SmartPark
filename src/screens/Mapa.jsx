import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors, spacing, radius } from '../styles/theme';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function Mapa({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      const initialRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setCurrentRegion(initialRegion);
      carregarEstacionamentos(currentLocation.coords.latitude, currentLocation.coords.longitude);
    })();
  }, []);

  const carregarEstacionamentos = async (lat, lng) => {
    try {
      const response = await api.get(`/estacionamentos/proximos`, {
        params: { lat, lng, raio: 10 }
      });
      console.log('Estacionamentos carregados:', response.data);
      setEstacionamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar estacionamentos:", error.response?.data || error.message);
      setErrorMsg("Não foi possível carregar os estacionamentos próximos.");
    } finally {
      setLoading(false);
    }
  };

  const zoomIn = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta / 2,
      longitudeDelta: currentRegion.longitudeDelta / 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion);
  };

  const zoomOut = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta * 2,
      longitudeDelta: currentRegion.longitudeDelta * 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion);
  };

  const centerOnLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={currentRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        zoomEnabled={true}
        scrollEnabled={true}
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
      >
        {estacionamentos.map((est) => {
          console.log('Renderizando estacionamento:', est.id, est.nome, est.endereco, est.valorHora);
          const markerTitle = est.nome.length > 20 ? est.nome.substring(0, 17) + '...' : est.nome;
          return (
            <Marker
              key={est.id}
              coordinate={{ latitude: est.latitude, longitude: est.longitude }}
              pinColor={colors.primary}
              title={markerTitle}
              description={`${est.endereco} - R$ ${est.valorHora.toFixed(2)}/h`}
              onCalloutPress={() => navigation.navigate('Vagas', { estacionamentoId: est.id })}
            />
          );
        })}
      </MapView>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnLocation}>
          <Ionicons name="locate" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 25,
    marginVertical: 5,
    elevation: 5,
  }
});
