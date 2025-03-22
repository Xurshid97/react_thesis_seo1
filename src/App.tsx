import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Autocomplete, TextField, Button, AppBar, Toolbar, Typography } from '@mui/material';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const crops = ['Wheat', 'Corn', 'Rice', 'Potatoes', 'Soybeans', 'Cotton', 'Vegetables'];

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    // Create a temporary circle and add to map
    const circle = L.circle([lat, lng], { radius: 1000 }).addTo(map);
    const bounds = circle.getBounds();
    
    // Fit bounds and then remove the temporary circle
    map.fitBounds(bounds);
    circle.remove();

    // Cleanup in case component unmounts before completing
    return () => {
      if (map.hasLayer(circle)) {
        map.removeLayer(circle);
      }
    };
  }, [lat, lng, map]);

  return null;
}

function MapComponent({ userLocation, plots }: { userLocation: { lat: number; lng: number } | null; plots: any[] }) {
  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Current Location</Popup>
        </Marker>
      )}

      <MarkerClusterGroup>
        {plots.map((plot) => (
          <Marker key={plot.id} position={[plot.lat, plot.lng]}>
            <Popup>
              <strong>Crop:</strong> {plot.crop}<br />
              <em>Planted on:</em> {new Date(plot.date).toLocaleDateString()}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </>
  );
}

export default function App() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [plots, setPlots] = useState<any[]>(() => {
    const saved = localStorage.getItem('plots');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('plots', JSON.stringify(plots));
  }, [plots]);

  const handleSave = () => {
    if (userLocation && selectedCrop) {
      const newPlot = {
        ...userLocation,
        crop: selectedCrop,
        id: Date.now(),
        date: new Date().toISOString(),
      };
      setPlots(prev => [...prev, newPlot]);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Farm Map Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <Autocomplete
          options={crops}
          sx={{ width: 300 }}
          onChange={(_, newValue) => setSelectedCrop(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Crop to Plant" />
          )}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!userLocation || !selectedCrop}
        >
          Save Plot
        </Button>
      </div>

      <div style={{ height: 'calc(100vh - 128px)', width: '100%' }}>
        <MapContainer
          center={userLocation || [20, 77]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <MapComponent userLocation={userLocation} plots={plots} />
          {userLocation && (
            <Recenter lat={userLocation.lat} lng={userLocation.lng} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}