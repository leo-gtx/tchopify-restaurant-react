import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker} from '@react-google-maps/api';
import { Skeleton } from '@material-ui/core';
import location from '@iconify/icons-ic/location-on';
import { Icon } from '@iconify/react';


Map.propTypes = {
    coords: PropTypes.array,
    center: PropTypes.object
};

export default function Map({coords, center}){
    const {t} = useTranslation();
    const [opacity, setOpacity] = useState(1);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACE_API_KEY,
    });


    if(!isLoaded){
        return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    }
   
    return (

                <GoogleMap
                zoom={6}
                center={center}
                mapContainerStyle={{ width: '100%', height: 400, borderRadius: 2}}
                options={{
                    streetViewControl: false,
                    zoomControl: false,
                    mapTypeControl: false,
                }}
                >
                   <Marker 
                    position={{ lat: 4.061536, lng: 9.786072 }}
                    icon={{url: '/static/icons/ic_marker.svg', scaledSize: { height: 20, width: 20 } }}
                    onMouseOver={()=> setOpacity(0.5)}
                    onMouseOut={()=> setOpacity(1)}
                    opacity={opacity}
                   />
                </GoogleMap>
    )
}