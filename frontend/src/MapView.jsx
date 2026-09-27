import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapView({
  parcels = [],
  start = "Bhopal",
  end = "Raisen",
  routeGeometry = null,
  corridorKm = 5,
}) {
  const bhopal = [23.2599, 77.4126];
  const raisen = [23.3315, 77.7819];

  /*
   * OSRM GeoJSON coordinates are:
   * [longitude, latitude]
   *
   * Leaflet expects:
   * [latitude, longitude]
   */
  const realRoutePoints =
    routeGeometry?.coordinates?.map(
      ([longitude, latitude]) => [latitude, longitude]
    ) || [];

  const validParcels = parcels.filter(
    (parcel) =>
      parcel.latitude !== null &&
      parcel.latitude !== undefined &&
      parcel.longitude !== null &&
      parcel.longitude !== undefined
  );

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      <MapContainer
        center={[23.295, 77.60]}
        zoom={10}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* REAL ROAD ROUTE FROM OSRM */}
        {realRoutePoints.length > 1 && (
          <Polyline
            positions={realRoutePoints}
            pathOptions={{
              color: "#2563eb",
              weight: 6,
              opacity: 0.9,
            }}
          />
        )}

        {/* APPROXIMATE CORRIDOR VISUAL */}
        <Circle
          center={bhopal}
          radius={corridorKm * 1000}
          pathOptions={{
            color: "#2563eb",
            fillColor: "#2563eb",
            fillOpacity: 0.06,
            weight: 1,
          }}
        />

        {/* START */}
        <Marker position={bhopal}>
          <Popup>
            <strong>Starting Point</strong>
            <br />
            {start}
          </Popup>
        </Marker>

        {/* DESTINATION */}
        <Marker position={raisen}>
          <Popup>
            <strong>Destination</strong>
            <br />
            {end}
          </Popup>
        </Marker>

        {/* DATABASE PARCELS */}
        {validParcels.map((parcel) => (
          <Marker
            key={parcel.land_id}
            position={[
              parcel.latitude,
              parcel.longitude,
            ]}
          >
            <Popup>
              <strong>{parcel.land_id}</strong>
              <br />
              Owner: {parcel.owner_name || "Not Available"}
              <br />
              Khasra: {parcel.khasra_number || "Not Available"}
              <br />
              Village: {parcel.village || "Not Available"}
              <br />
              District: {parcel.district || "Not Available"}
              <br />
              Area: {parcel.area_acres ?? 0} Acres
              <br />
              Distance:{" "}
              {parcel.distance_from_route_km ?? 0} KM
              <br />
              Status:{" "}
              {parcel.acquisition_status || "Not Available"}
              <br />
              Compensation:{" "}
              {parcel.compensation_status || "Pending"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
