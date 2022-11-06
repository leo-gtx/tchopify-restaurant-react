import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoBox} from '@react-google-maps/api';
import { Skeleton, Typography, Card} from '@material-ui/core';


Map.propTypes = {
    coords: PropTypes.array,
    center: PropTypes.object
};

export default function Map({coords, center}){
    // const {t} = useTranslation();
    const [isVisible, setVisible] = useState();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACE_API_KEY,
    });


    if(!isLoaded){
        return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    }

    const handleToggleVisible = (index)=>setVisible(index)
   
    return (

                <GoogleMap
                zoom={6}
                center={center}
                mapContainerStyle={{ width: '100%', height: 400, borderRadius: 2}}
                options={{
                    streetViewControl: false,
                    zoomControl: false,
                    mapTypeControl: false,
                    disableDoubleClickZoom: true,
                }}
                >
                    {
                        coords.map((coord, index)=>(
                                <InfoBox
                                key={index}
                                    position={{ lat: coord.lat, lng: coord.lng }}
                                    options={{
                                        enableEventPropagation: true,
                                        closeBoxURL: '',
                                        visible: isVisible === index,
                                    }}
                                    
                                >
                                    <Card variant='elevation' sx={{ height: 30, width: 100, textAlign: 'center'}}>
                                            <Typography variant='h6'>{coord.title}</Typography>
                                    </Card>
                                </InfoBox>
                        ))
                    }
                    {
                        coords.map((coord, index)=>(
                            <Marker 
                                    key={index}
                                    position={{ lat: coord.lat, lng: coord.lng }}
                                    icon={{
                                        url: '/static/icons/ic_marker.svg',
                                        scaledSize: { height: 30, width: 30 },
                                    }}
                                    onMouseOver={()=>handleToggleVisible(index)}
                                    onMouseOut={()=>handleToggleVisible(null)}
                                />
                        ))
                    }
                  
                </GoogleMap>
    )
}