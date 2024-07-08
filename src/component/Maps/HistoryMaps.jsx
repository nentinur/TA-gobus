import React, { useState, useEffect } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Icon } from "leaflet";
import geojsonData from "../../../src/rute.json";

Leaflet.Icon.Default.imagePath = "../node_modules/leaflet";
// Buat ikon kustom
const customIcon = new Icon({
  iconUrl: require("../../../src/bus-icon.png"), // Ganti dengan path ke gambar PNG Anda
  iconSize: [38, 38], // Ukuran ikon (lebar dan tinggi)
});

delete Leaflet.Icon.Default.prototype._getIconUrl;

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function HistoryMaps(props) {
  return (
    <MapContainer
      center={[props.lat_naik, props.lon_naik]}
      zoom={14}
      style={{ height: "400px", margin: "10px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TrackMaps no_bus={props.no_bus} />
      <CurrrentPosition lat_naik={props.lat_naik} lon_naik={props.lon_naik} />
      <GeoJSON style={{ weight: 5 }} data={geojsonData.features} />
    </MapContainer>
  );
}

function TrackMaps(props) {
  const { no_bus: nobus } = props;
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    const fetchPosition = () => {
      axios
        .get("http://localhost:3100/posisi")
        .then((response) => {
          const lat = response.data[0].lat;
          const lng = response.data[0].lng;
          const parsedLat = parseFloat(lat);
          const parsedLng = parseFloat(lng);
          console.log("position bus:", lat, lng);

          // Validasi bahwa lat dan lng adalah angka
          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            setLat(parsedLat);
            setLng(parsedLng);
          } else {
            console.error("Received invalid lat/lng values:", lat, lng);
          }
        })
        .catch((error) => {
          console.error("Error fetching position:", error);
        });
    };

    // Mulai interval
    const intervalId = setInterval(fetchPosition, 3000);

    // Hentikan interval ketika komponen di-unmount atau nobus berubah
    return () => {
      clearInterval(intervalId);
    };
  }, [nobus]);

  // Jika lat dan lng adalah null atau tidak valid, tidak render Marker
  return lat !== null && lng !== null ? (
    <Marker icon={customIcon} position={[lat, lng]}>
      <Popup>Bus {nobus}</Popup>
    </Marker>
  ) : null;
}

// mengambil posisi terkini
const CurrrentPosition = (props) => {
  return props.lat_naik !== null && props.lon_naik !== null ? (
    <Marker position={[props.lat_naik, props.lon_naik]}>
      <Popup>Titik Naik Anda</Popup>
    </Marker>
  ) : null;
};
