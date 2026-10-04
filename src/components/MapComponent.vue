<template>
  <div class="relative w-full h-full">
    <!-- Map Container -->
    <div id="map" class="w-full h-full z-0"></div>
    
    <!-- Floating Header -->
    <div class="absolute top-6 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
      <div class="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/50 pointer-events-auto flex items-center space-x-3">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        <span class="font-bold text-gray-800 tracking-wide">Live Location</span>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div class="absolute bottom-8 right-6 z-[1000] flex flex-col space-y-4">
      <button @click="recenterMap" class="bg-white p-4 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { database } from '../firebase';
import { ref as dbRef, set, onValue } from 'firebase/database';

// Fix leaflet icon issue in Vue/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

let map = null;
let userMarker = null;
const otherMarkers = {};
const currentLocation = ref(null);

// Generate or retrieve a random user ID for this browser session
const getUserId = () => {
  let id = localStorage.getItem('couple_map_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('couple_map_user_id', id);
  }
  return id;
};
const userId = getUserId();

// Generate avatar icon based on ID
const getUserIcon = (id, isCurrentUser = false) => {
  const bgColor = isCurrentUser ? 'bg-blue-500' : 'bg-pink-500';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-12 h-12 ${bgColor} rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transform hover:scale-110 transition-transform">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${id}" alt="avatar" class="w-full h-full object-cover" />
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
};

const userIcon = getUserIcon(userId, true);

const recenterMap = () => {
  if (map && currentLocation.value) {
    map.flyTo([currentLocation.value.lat, currentLocation.value.lng], 16, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }
};

const updateLocationToFirebase = (lat, lng) => {
  const locationRef = dbRef(database, 'Live_Locations/' + userId);
  set(locationRef, {
    ID_user: userId,
    Lat: lat,
    Lng: lng,
    Last_updated: Date.now()
  });
};

const listenToOtherUsers = () => {
  const locationsRef = dbRef(database, 'Live_Locations');
  onValue(locationsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Check all users
    Object.keys(data).forEach((key) => {
      const user = data[key];
      // Ignore current user
      if (user.ID_user === userId) return;

      const latLng = [user.Lat, user.Lng];

      if (otherMarkers[user.ID_user]) {
        // Update existing marker
        otherMarkers[user.ID_user].setLatLng(latLng);
      } else {
        // Create new marker for other user
        const newMarker = L.marker(latLng, { icon: getUserIcon(user.ID_user, false) }).addTo(map);
        newMarker.bindPopup(`<div class="font-bold text-gray-800">Người ấy (${user.ID_user.substring(0, 8)})</div>`);
        otherMarkers[user.ID_user] = newMarker;
      }
    });
  });
};

onMounted(() => {
  map = L.map('map', {
    zoomControl: false 
  }).setView([10.8231, 106.6297], 13);

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps',
    maxZoom: 19
  }).addTo(map);

  // Listen to other users' movements
  listenToOtherUsers();

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      currentLocation.value = { lat: latitude, lng: longitude };
      
      if (!userMarker) {
        map.setView([latitude, longitude], 16);
        userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        userMarker.bindPopup('<div class="font-bold text-gray-800">Bạn đang ở đây</div>').openPopup();
      } else {
        userMarker.setLatLng([latitude, longitude]);
      }

      updateLocationToFirebase(latitude, longitude);

    }, (error) => {
      console.error("Lỗi lấy vị trí:", error);
    }, {
      enableHighAccuracy: true
    });
  }
});

onUnmounted(() => {
  if (map) map.remove();
});
</script>

<style>
.leaflet-popup-content-wrapper {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  padding: 4px;
}
.leaflet-popup-tip-container {
  margin-top: -1px;
}
.leaflet-container {
  font-family: inherit;
  z-index: 0;
}
</style>
