let map;
let markers = [];
let locations = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 1.290270, lng: 103.851959 } // Default to Singapore center
    });

    fetch('locations.json')
        .then(response => response.json())
        .then(data => {
            locations = data;
            addMarkers('All'); // Show all locations by default
        })
        .catch(error => console.error('Error fetching locations:', error));

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            addMarkers(type);
        });
    });
}

function addMarkers(type) {
    // Remove existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // Add new markers based on filter
    locations.forEach(location => {
        if (type === 'All' || location["Type in AMEX Website"] === type) {
            const marker = new google.maps.Marker({
                position: location.geometry.location,
                map: map,
                title: location.name
            });

            const infowindow = new google.maps.InfoWindow({
                content: `<h3>${location.name}</h3><p>${location.formatted_address}</p><p>Rating: ${location.rating}</p>`
            });

            marker.addListener('click', () => {
                infowindow.open(map, marker);
            });

            markers.push(marker);
        }
    });
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker Registered'))
    .catch(err => console.log('Service Worker Not Registered', err));
}
