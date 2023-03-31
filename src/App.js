import './App.css'
import * as React from 'react'
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import PushPinIcon from '@mui/icons-material/PushPin'
import StarRateIcon from '@mui/icons-material/StarRate'

function App() {
  const [pins, setPins] = React.useState([])
  const [viewport, setViewport] = React.useState({
    longitude: 12.4,
    latitude: 37.8,
    zoom: 14,
  })

  const [currentPlaceId, setCurrentPlaceId] = React.useState(null)

  const handleMarkerClicked = (id, lat, lon) => {
    console.log(lat)
    console.log(lon)
    setCurrentPlaceId(id)
  }

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get('/pins')
        // console.log(response)
        setPins(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    getPins()
  }, [])

  return (
    <div className="App">
      <Map
        container={'map'}
        projection={'globe'}
        initialViewState={{ viewport }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/kraigmansfield/clfwq36do000d01mziph590uf"
      >
        <NavigationControl />
        {pins.map((p) => (
          <>
            <Marker longitude={p.lon} latitude={p.lat} anchor="center">
              <PushPinIcon
                className="icon"
                onClick={() => handleMarkerClicked(p._id, p.lat, p.lon)}
                style={{ fontSize: viewport.zoom * 2, color: 'slateblue' }}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.lon}
                latitude={p.lat}
                closeOnClick={false}
                closeOnMove={false}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="description">{p.description}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarRateIcon className="star" />)}
                  </div>
                </div>

                <label>Information</label>
                
              </Popup>
            )}
          </>
        ))}
      </Map>
    </div>
  )
}

export default App
