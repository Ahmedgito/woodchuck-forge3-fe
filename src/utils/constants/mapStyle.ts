export const mapStyle= [
           
            {
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }], // grey text for labels
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#616161', visibility: 'on' }], // darker grey for city names
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.province',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575', visibility: 'on' }], // show province/state names
            },
            {
              featureType: 'administrative.province',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e', visibility: 'on' }], // show country names
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels.text.stroke',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [{ visibility: 'off' }], // hide borders but keep labels
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.fill',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }], // remove points of interest
            },
            {
              featureType: 'transit',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#bdbdbd' }], // grey water
            },
            {
              featureType: 'water',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#9e9e9e' }], // darker grey for water borders
            },
            {
              featureType: 'water',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }], // hide water labels
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#fafafa' }], // off-white for landscape
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry.fill',
              stylers: [{ color: '#fafafa' }], // off-white for natural landscape
            },
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }],
            },
          ]
    
      
