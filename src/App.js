import * as React from 'react';
import {useState, useMemo} from 'react';
import {render} from 'react-dom';
import ReactMapboxGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl
} from 'react-map-gl';
import mapboxgl from "mapbox-gl";

import Pin from './components/Pin';

import hmoData from './data/hmo.json'


// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const TOKEN = process.env.REACT_APP_MAPBOX_API;

export default function App() {
  const [popupInfo, setPopupInfo] = useState(null);

  const pins = useMemo(
    () =>
      hmoData.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <div id="map">
      <ReactMapboxGL
        initialViewState={{
          latitude: 51.56,
          longitude: -0.07,
          zoom: 14,
          bearing: 0,
          pitch: 0
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={TOKEN}
        style={Object.assign({ width: '100vw', overflowX: 'hidden' }, { height: '100vh' })}
      >
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <p>Address: {popupInfo.Property_address}</p>
              <p>License holder name: {popupInfo.Licence_holder_name}</p>
              <p>License type: {popupInfo.Licence_type}</p>
              <p>License start date: {popupInfo.Licence_start_date}</p>
              <p>License end date: {popupInfo.Licence_end_date}</p>
            </div>
          </Popup>
        )}
      </ReactMapboxGL>
    </div>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}