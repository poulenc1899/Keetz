import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import GoogleMapReact from 'google-map-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import PlaceIcon from '@mui/icons-material/PushPin';
import allowedOrigins from './allowedOrigins';
import { Autocomplete } from '@mui/lab';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import config from './config';
const mongoose = require('mongoose');

// Define the schema
const poiSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    title: String,
    description: String
  });
  
  // Create the model from the schema
  const POImodel = mongoose.model('POI', poiSchema);


function Map() { 
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: config.googleMapsApiKey,
      libraries: ['places', 'maps']
    });

    const [locations, setLocations] = useState([]);
    const [searchBox, setSearchBox] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPOI, setNewPOI] = useState({ title: '', description: '' });

    useEffect(() => {
      fetch('http://192.168.2.14:3001/pois')
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


const POI = ({ title, description, index }) => {
    let navigate = useNavigate();
    return (
      <Tooltip title={title} placement="top">
        <PlaceIcon 
          className="drop"
          style={{ fontSize: 50, color: "#9E59DA", cursor: 'hand', animationDelay: `${index * 0.1}s` }} // Increased the fontSize value to make the marker bigger
          onClick={() => navigate(`/poi/${title}/${description}`)}
        />
      </Tooltip>
    );
  };

    const handleAddPOI = () => {
      const hostname = window.location.hostname;
      if (allowedOrigins.includes(hostname)) {
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
      }
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
            <Button onClick={handleAddPOI}>Add</Button>
          </DialogActions>
        </Dialog>

        <GoogleMapReact
          bootstrapURLKeys={{ key: config.googleMapsApiKey }}
          defaultCenter={{ lat: 52.3702, lng: 4.8952 }}
          defaultZoom={15}
          options={{
            styles: 
            [
                {
                    "featureType": "administrative",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#444444"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#e9e6de"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi.attraction",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.government",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.medical",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#95da59"
                        }
                    ]
                },
                {
                    "featureType": "poi.place_of_worship",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.school",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#7ddde6"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ],
            disableDefaultUI: true,
          }}
        >
          {renderMarkers && locations.map((location, index) => (
            <POI
              lat={location.lat}
              lng={location.lng}
              title={location.title}
              description={location.description}
              key={location.title}
              index={index}
            />
          ))}
        </GoogleMapReact>
      </div> 
    ) : <div>Loading...</div>; 
  } 

  export default Map;
