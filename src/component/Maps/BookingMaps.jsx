import React, { useState, useEffect } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

Leaflet.Icon.Default.imagePath = "../node_modules/leaflet";

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const initialPosition = {
  lat: -6.9316648,
  lng: 107.7229107,
};

export default function BookingMaps({ onChange }) {
  const [center, setCenter] = useState(initialPosition);
  const [markerPosition, setMarkerPosition] = useState(initialPosition);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter = { lat: latitude, lng: longitude };
        setCenter(newCenter);
        setMarkerPosition(newCenter);
      },
      (err) => console.error(err)
    );
  }, []);

  const handleMarkerDrag = (e) => {
    const newPosition = e.target.getLatLng();
    setMarkerPosition(newPosition);
    setCenter(newPosition);
    onChange(newPosition); // Mengirimkan nilai titik naik ke komponen induk
  };

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "400px", margin: "10px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable={true}
        eventHandlers={{ dragend: handleMarkerDrag }}
        position={markerPosition}
      >
        <Popup minWidth={90}>
          Silakan sesuaikan titik dimana Anda akan naik
        </Popup>
      </Marker>
    </MapContainer>
  );
}
