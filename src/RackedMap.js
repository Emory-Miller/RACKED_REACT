import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Map,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import * as L from "leaflet";
import Title from "./Title";
import * as myDefaultImage from "./DefaultImage";

export const icon = new Icon({
  iconUrl: "/bike-svgrepo-com.svg",
  iconSize: [30, 30],
});

export default function RackedMap() {
  const urlRacks = "http://localhost:8080/api/racks";

  const [racks, setRacks] = useState([]);

  const fetchDataRacks = () => {
    fetch(urlRacks)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRacks(data);
      });
  };

  useEffect(() => {
    fetchDataRacks();
  }, []);

  const urlReviews = "http://localhost:8080/api/reviews";

  const [reviews, setReviews] = useState([]);

  const fetchDataReviews = () => {
    fetch(urlReviews)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setReviews(data);
      });
  };

  useEffect(() => {
    fetchDataReviews();
  }, []);

  const [activeRack, setActiveRack] = React.useState(null);

  const [image, setImage] = React.useState(null);

  const imgSrc = "data:image/png;base64," + image;

  const [activeReview, setActiveReview] = React.useState(null);

  const [clickLocation, setClickLocation] = React.useState(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setClickLocation(e);
        setActiveRack(null);
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      },
    });
    return null;
  };

  const defaultImage = myDefaultImage.defaultImage;

  function createRack(NameValue) {
    fetch("http://localhost:8080/api/racks/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: NameValue,
        longitude: clickLocation.latlng.lng,
        latitude: clickLocation.latlng.lat,
        image: defaultImage,
        imageContentType: "image/png",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  const [rackName, setRackName] = React.useState("");

  function handleChange(e) {
    setRackName(e.target.value);
  }

  return (
    <MapContainer
      center={[38.71666369749177, -75.07651347222257]}
      zoom={15}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {racks.map((rack) => (
        <Marker
          key={rack.id}
          position={[rack.latitude, rack.longitude]}
          eventHandlers={{
            click: (e) => {
              setActiveRack(rack);
              setImage(rack.image);
              setClickLocation(null);
            },
          }}
          icon={icon}
        />
      ))}

      <MapEvents />

      {clickLocation && (
        <Popup
          position={[clickLocation.latlng.lat, clickLocation.latlng.lng]}
          onClose={() => {
            setActiveRack(null);
            setClickLocation(null);
          }}
        >
          <div>
            <h2>RACK IT?</h2>
            <form>
              <input
                type="text"
                placeholder="..."
                onChange={handleChange}
                value={rackName}
              />
              <button onClick={() => createRack(rackName)}>
                Register Rack
              </button>
            </form>
          </div>
        </Popup>
      )}

      {activeRack && (
        <Popup
          position={[activeRack.latitude, activeRack.longitude]}
          onClose={() => {
            setActiveRack(null);
            setClickLocation(null);
          }}
        >
          <div>
            <h2>{activeRack.name}</h2>
            <img src={imgSrc} className="rackImage" />
          </div>
        </Popup>
      )}
    </MapContainer>
  );
}
