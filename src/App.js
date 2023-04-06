import './App.css'
import * as React from 'react'
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'
import PushPinIcon from '@mui/icons-material/PushPin'
import StarRateIcon from '@mui/icons-material/StarRate'
import { format } from 'timeago.js'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import ReactMapGL, { FlyToInterpolator } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default

function App() {
  const [pins, setPins] = React.useState([])

  const [viewport, setViewport] = React.useState({
    longitude: 12.4,
    latitude: 37.8,
    zoom: 14,
  })

  const [currentPlaceId, setCurrentPlaceId] = React.useState(null)
  const [newPlace, setNewPlace] = React.useState(null)
  const [title, setTitle] = React.useState(null)
  const [description, setDescription] = React.useState(null)
  const [currentUser, setCurrentUser] = React.useState(null)

  const [showRegister, setShowRegister] = React.useState(false)
  const [showLogin, setShowLogin] = React.useState(false)

  const [rating, setRating] = React.useState(1)
  const handleAddClick = (e) => {
    console.log(e)
    let lat = e.lngLat.lat
    let lon = e.lngLat.lng

    setNewPlace({
      lat: lat,
      lng: lon,
    })
  }

  const handlePinSubmit = async (e) => {
    e.preventDefault()

    const newPin = {
      username: currentUser,
      title: title,
      rating: rating,
      description: description,
      lat: newPlace.lat,
      lon: newPlace.lng,
    }

    try {
      if (!currentUser) {
      } else {
        // const response = await axios.post("https://noun-d-be.herokuapp.com/api/pins", newPin)
        const response = await axios.post('pins', newPin)
        console.log(response)
        setPins([...pins, response.data])
        setNewPlace(null)

        setRating(1)
        setDescription(null)
        setTitle(null)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleMarkerClicked = (id, lat, lon) => {
    console.log(lat)
    console.log(lon)
    setCurrentPlaceId(id)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const response = await axios.get('pins')
        console.log(response)
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
        onDblClick={handleAddClick}
      >
        <NavigationControl />
        {pins.map((p) => (
          <>
            <Marker longitude={p.lon} latitude={p.lat} anchor="center">
              <PushPinIcon
                className="icon"
                onClick={() => handleMarkerClicked(p._id, p.lat, p.lon)}
                style={{
                  fontSize: viewport.zoom * 2,
                  color: p.username === currentUser ? 'tomato' : 'slateblue',
                }}
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
                <div className="info">
                  <span className="username">
                    Created by <b>{p.username} </b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            closeOnClick={false}
            closeOnMove={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handlePinSubmit}>
                <label className='title_label'>Title:</label>
                <input
                  placeholder="Enter a Title"
                  onChange={(e) => setTitle(e.target.value)}
                />

                <br></br>

                <label className='review_label'>Review:</label>
                <textarea className='textbox'
                  placeholder="Say something about this place"
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label className='rating_label'>Rating:</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <br></br>
                
                <button className="submitBtn" type="submit">
                  Add Pin{' '}
                </button>
              </form>
            </div>
          </Popup>
        )}
      </Map>

      <div className="footer">
        <div className="footer_down">
          {currentUser ? (
            <button className="button_logout" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <div>
              <button
                className="button login"
                onClick={() => {
                  setShowLogin(true)
                }}
              >
                Login
              </button>
              <button
                className="button register"
                onClick={() => {
                  setShowRegister(true)
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} />
      )}
    </div>
  )
}

export default App
