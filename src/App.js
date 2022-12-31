import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Map, MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon } from 'leaflet';

function MyComponent() {
  const map = useMap()
  console.log('map center:', map.getCenter())
  return null
}


export default function App(){
  
  const urlRacks = "http://localhost:8080/api/racks";

  const [racks, setRacks] = useState([]);

  const fetchDataRacks = () => {
    fetch(urlRacks)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setRacks(data)
      })
  };

  useEffect(() => {
    fetchDataRacks()
  }, [])

  console.log(racks);

  const urlReviews = "http://localhost:8080/api/reviews";

  const [reviews, setReviews] = useState([]);

  const fetchDataReviews = () => {
    fetch(urlReviews)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setRacks(data)
      })
  };

  console.log(reviews);

  const [activeRack, setActiveRack] = React.useState(null);

  console.log("active rack" +activeRack);

  return(
<MapContainer center={[38.71666369749177, -75.07651347222257]} zoom={15} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {racks.map(rack => (
    <Marker
    key={rack.id}
    position={[
      rack.latitude, 
      rack.longitude
    ]}
    eventHandlers={{
      click: (e) => {
        setActiveRack(rack)
      }
    }}
    // onClick={() => {
    //   setActiveRack(rack);
    // }}
    />
  ))}

  {activeRack && (
            <Popup
              position={[
                activeRack.latitude,
                activeRack.longitude
              ]}
              onClose={() => {
                setActiveRack(null);
              }}
            >
              <div>
                <p>{activeRack.name}</p>
                {/* <img src="data:" + {rack.imageContentType} + "," + {rack.image} > */}
              </div>
            </Popup>
          )}

</MapContainer>
  );
}