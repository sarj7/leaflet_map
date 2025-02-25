"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as turf from "@turf/turf";
import { LatLngExpression, LatLng, Map as LeafletMap } from "leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });

// Import LayersControl and BaseLayer separately
const LayersControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl),
  { ssr: false }
);

const BaseLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayersControl.BaseLayer),
  { ssr: false }
);

interface GeodesicLine {
    positions: LatLngExpression[];
    color: string;
}

export default function LeafletMap() {
    const [markers, setMarkers] = useState<LatLngExpression[]>([]);
    const [geodesicLine, setGeodesicLine] = useState<GeodesicLine | null>(null);
    const [distance, setDistance] = useState<string | null>(null);
    const [key, setKey] = useState(Date.now()); // Add key for forcing remount
    const mapRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        // Fix Leaflet's default icon issue
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "/marker-icon-2x.png",
            iconUrl: "/marker-icon.png",
            shadowUrl: "/marker-shadow.png",
        });

        // Cleanup function
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const calculateGeodesicLine = (start: LatLngExpression, end: LatLngExpression) => {
        const startPoint = turf.point([
            typeof start[1] === 'number' ? start[1] : start.lng,
            typeof start[0] === 'number' ? start[0] : start.lat
        ]);
        const endPoint = turf.point([
            typeof end[1] === 'number' ? end[1] : end.lng,
            typeof end[0] === 'number' ? end[0] : end.lat
        ]);

        // Create great circle line
        const greatCircle = turf.greatCircle(startPoint, endPoint, {
            npoints: 100,
            offset: 10
        });

        // Extract coordinates for the line
        const lineCoordinates = greatCircle.geometry.coordinates.map(
            coord => [coord[1], coord[0]] as LatLngExpression
        );

        // Calculate distance
        const distance = turf.distance(startPoint, endPoint, { units: 'kilometers' });

        setGeodesicLine({
            positions: lineCoordinates,
            color: '#FF4444'
        });
        setDistance(distance.toFixed(2));
    };

    return (
        <div className="relative w-full h-screen">
            <MapContainer 
                key={key}
                center={[20, 0]} 
                zoom={3} 
                className="h-full w-full"
                whenCreated={(map) => {
                    mapRef.current = map;
                    map.on('click', (e: L.LeafletMouseEvent) => {
                        const newMarker: LatLngExpression = [e.latlng.lat, e.latlng.lng];
                        
                        if (markers.length < 2) {
                            const newMarkers = [...markers, newMarker];
                            setMarkers(newMarkers);

                            if (newMarkers.length === 2) {
                                calculateGeodesicLine(newMarkers[0], newMarkers[1]);
                            }
                        } else {
                            setMarkers([newMarker]);
                            setGeodesicLine(null);
                            setDistance(null);
                        }
                    });
                }}
            >
                <LayersControl position="topright">
                    <BaseLayer checked name="OpenStreetMap Standard">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </BaseLayer>
                    <BaseLayer name="OpenStreetMap Humanitarian">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
                        />
                    </BaseLayer>
                    <BaseLayer name="OpenStreetMap Cycling">
                        <TileLayer
                            url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
                            attribution='<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            maxZoom={20}
                        />
                    </BaseLayer>
                    <BaseLayer name="OpenStreetMap Transport">
                        <TileLayer
                            url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
                            maxZoom={19}
                        />
                    </BaseLayer>
                    <BaseLayer name="Satellite">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        />
                    </BaseLayer>
                    <BaseLayer name="Terrain">
                        <TileLayer
                            url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.jpg"
                            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com/">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/">OpenStreetMap</a> contributors'
                            maxZoom={18}
                        />
                    </BaseLayer>
                    <BaseLayer name="Topographic">
                        <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                            maxZoom={17}
                        />
                    </BaseLayer>
                    <BaseLayer name="Dark Matter">
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            maxZoom={19}
                        />
                    </BaseLayer>
                    <BaseLayer name="Watercolor">
                        <TileLayer
                            url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
                            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com/">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/">OpenStreetMap</a> contributors'
                            maxZoom={16}
                        />
                    </BaseLayer>
                </LayersControl>

                {markers.map((position, index) => (
                    <Marker key={index} position={position}>
                        <Popup>
                            {index === 0 ? "Start Point" : "End Point"}
                            <br />
                            Lat: {typeof position[0] === 'number' ? position[0].toFixed(4) : position[0]}
                            <br />
                            Lng: {typeof position[1] === 'number' ? position[1].toFixed(4) : position[1]}
                        </Popup>
                    </Marker>
                ))}

                {geodesicLine && (
                    <GeodesicLine
                        positions={geodesicLine.positions}
                        color={geodesicLine.color}
                    />
                )}
            </MapContainer>

            {distance && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                    <h3 className="font-bold">Distance</h3>
                    <p>{distance} km</p>
                </div>
            )}
        </div>
    );
}

// Update GeodesicLine component to use the dynamically imported Polyline
const GeodesicLine = ({ positions, color }: GeodesicLine) => (
    <Polyline
        positions={positions}
        color={color}
        weight={3}
        opacity={0.8}
    />
);

