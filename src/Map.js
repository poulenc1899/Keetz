import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PlaceIcon from '@mui/icons-material/PushPin';
import { Autocomplete } from '@mui/lab';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import config from './config';
import MapStyle from './MapStyle';
const mongoose = require('mongoose');
//const hostname = window.location.hostname;
const hostname = 'localhost';

// Define the schema
const poiSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    title: String,
    description: String
  });
  
  // Create the model from the schema
  const POImodel = mongoose.model('POI', poiSchema);

const libraries = ['places', 'maps'];

const POI = ({ lat, lng, title, description, index }) => {
  let navigate = useNavigate();
  return (
    <Marker
      position={{ lat, lng }}
      onClick={() => navigate(`/poi/${title}/${description}`)}
      icon={{
        url: 'android-chrome-192x192.png', // using a mui pin icon
        scaledSize: new window.google.maps.Size(50, 50) // size
      }}
    >
      <Tooltip title={title} placement="top">
        <PlaceIcon 
          className="drop"
          style={{ fontSize: 50, color: "#9E59DA", cursor: 'hand', animationDelay: `${index * 0.1}s` }} // Increased the fontSize value to make the marker bigger
        />
      </Tooltip>
    </Marker>
  );
};

function Map() { 
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: config.googleMapsApiKey,
      libraries: libraries
    });

    const [locations, setLocations] = useState([]);
    const [searchBox, setSearchBox] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPOI, setNewPOI] = useState({ title: '', description: '' });

    useEffect(() => {
      fetch(`http://${hostname}:3001/pois`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setLocations(data))
        .catch(error => console.log('Fetch error: ', error));
    }, []);

    const [renderMarkers, setRenderMarkers] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setRenderMarkers(true);
      }, 500);
    }, []);

    const handleAddPOI = () => {
        fetch(`http://${hostname}:3001/pois`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newPOI, lat: selectedPlace.lat, lng: selectedPlace.lng }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => setLocations([...locations, data]))
          .catch(error => console.log('Fetch error: ', error));
      
      setModalOpen(false);
    };

    return isLoaded ? ( 
      <div className='Map' style={{ height: '93vh', width: '100%' }}> 
        <Typography variant='h2' style={{textAlign : "Center", fontSize: '3em', color: '#9E59DA', fontWeight: 'bold' }}>Keetz</Typography> 
        
        <StandaloneSearchBox onLoad={ref => setSearchBox(ref)} onPlacesChanged={() => {
          const place = searchBox.getPlaces()[0];
          setSelectedPlace({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            title: place.name
          });
          setModalOpen(true);
        }}>
          <TextField fullWidth label="Search places" />
        </StandaloneSearchBox>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Add a new point of interest</DialogTitle>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddPOI();
          }}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                value={newPOI.title}
                onChange={e => setNewPOI({ ...newPOI, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                value={newPOI.description}
                onChange={e => setNewPOI({ ...newPOI, description: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" color="primary">Add</Button>
            </DialogActions>
          </form>
        </Dialog>

        <GoogleMap
          mapContainerStyle={{ height: '93vh', width: '100%' }}
          center={{ lat: 52.3702, lng: 4.8952 }}
          zoom={15}
          options={{
            disableDefaultUI: true, // This will disable the default UI including the zoom control
            styles: MapStyle
          }}
        >
          {renderMarkers && locations.map((location, index) => (
            <POI
              lat={location.lat}
              lng={location.lng}
              title={location.title}
              description={location.description}
              key={index}
              index={index}
            />
          ))}
        </GoogleMap>
      </div> 
    ) : <div>Loading...</div>; 
  } 

  export default Map;
