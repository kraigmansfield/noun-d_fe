import './App.css';
import * as React from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';


function App() {

  const [pins, setPins] = React.useState([])

  React.useEffect(() => {
    const getPins = async() => {
      try{
        const response = await axios.get("/pins")
        setPins(response.data)

      }catch(err){
        console.log(err)
      }

    }
    getPins()
  },[])
  
 
  return (
    <div className="App">

      <Map
      container = {'map'}
      projection={'globe'}
      initialViewState={{}}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      style={{width:"100vw", height:"100vh"}}
      mapStyle='mapbox://styles/kraigmansfield/clfwq36do000d01mziph590uf'
    >
      <NavigationControl/>


      </Map>
    </div>
  );
}

export default App;
