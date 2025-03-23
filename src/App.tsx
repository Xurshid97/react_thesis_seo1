import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import './App.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import SearchBar from './components/SearchBar';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


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
      />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Sizning joyingiz</Popup>
        </Marker>
      )}

      <MarkerClusterGroup>
        {plots.map((plot) => (
          <Marker key={plot.id} position={[plot.lat, plot.lng]}>
            <Popup>
              <strong>O'simlik:</strong> {plot.crop}<br />
              <em>Ekilgan vaqt:</em> {new Date(plot.date).toLocaleDateString()}
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
    <div style={{width: '100vw', height: '100vh', backgroundColor: '#f5f5f5'}}>
      <div className='screenCrop' >
        <SearchBar selectedCrop = {selectedCrop} setSelectedCrop={setSelectedCrop} userLocation={userLocation} handleSave={handleSave}/>

        {/* Map container */}
        <div style={{ height:'100vh', width: '100%', position: 'absolute', zIndex: 99}}>
          <MapContainer
            center={userLocation || [20, 77]}
            zoom={5}
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <MapComponent userLocation={userLocation} plots={plots} />
            {userLocation && (
              <Recenter lat={userLocation.lat} lng={userLocation.lng} />
            )}
            <ZoomControl position="bottomright" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}