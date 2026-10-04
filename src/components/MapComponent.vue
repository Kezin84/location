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
      <!-- Profile Button -->
      <button @click="showProfileModal = true" class="bg-white p-4 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-colors" title="Cập nhật hồ sơ">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      <!-- Recenter Button -->
      <button @click="recenterMap" class="bg-white p-4 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-colors" title="Vị trí của tôi">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="absolute inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
        <div class="px-6 py-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Hồ Sơ Của Bạn</h2>
            <button @click="showProfileModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tên hiển thị</label>
              <input v-model="profileForm.Name" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all" placeholder="Nhập tên của bạn">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
              <input v-model="profileForm.Phone" type="tel" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all" placeholder="Nhập số điện thoại">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ảnh Đại Diện</label>
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner">
                  <img v-if="profileForm.Img" :src="profileForm.Img" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>
                <div class="flex-1">
                  <label :class="{'opacity-50 cursor-not-allowed': isUploading, 'cursor-pointer hover:bg-gray-50': !isUploading}" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 transition-colors">
                    <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span v-if="isUploading">Đang tải lên...</span>
                    <span v-else>Chọn ảnh từ máy</span>
                    <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" :disabled="isUploading">
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <button @click="saveProfile" class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98]">
              Lưu Thông Tin
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { database } from '../firebase';
import { ref as dbRef, set, onValue, get } from 'firebase/database';

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

const usersProfile = ref({});
const showProfileModal = ref(false);
const profileForm = ref({ Name: '', Phone: '', Img: '' });
const isUploading = ref(false);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload?key=b202a4bdc79bf1dc72f6f6ded6b74501', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      profileForm.value.Img = data.data.url;
    } else {
      console.error('Upload failed', data);
      alert('Tải ảnh lên thất bại, vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Error uploading image', error);
    alert('Có lỗi xảy ra khi tải ảnh lên.');
  } finally {
    isUploading.value = false;
  }
};

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

// Fetch initial profile manually
const fetchMyProfile = async () => {
  const profileRef = dbRef(database, 'Users/' + userId);
  const snap = await get(profileRef);
  if (snap.exists()) {
    profileForm.value = { ...profileForm.value, ...snap.val() };
  }
};

const saveProfile = async () => {
  const profileRef = dbRef(database, 'Users/' + userId);
  await set(profileRef, {
    ID_user: userId,
    Name: profileForm.value.Name,
    Phone: profileForm.value.Phone,
    Img: profileForm.value.Img
  });
  showProfileModal.value = false;
  
  // Immedately update my own marker
  if (userMarker) {
    userMarker.setIcon(getUserIcon(userId, true));
    userMarker.setPopupContent(`<div class="font-bold text-gray-800">${profileForm.value.Name || 'Bạn đang ở đây'}</div>`);
  }
};

// Generate avatar icon based on ID and Users profile
const getUserIcon = (id, isCurrentUser = false) => {
  const bgColor = isCurrentUser ? 'bg-blue-500' : 'bg-pink-500';
  const profile = usersProfile.value[id] || {};
  
  // Use custom image if available, else fallback to dicebear
  const imgSrc = profile.Img ? profile.Img : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-12 h-12 ${bgColor} rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transform hover:scale-110 transition-transform">
             <img src="${imgSrc}" alt="avatar" class="w-full h-full object-cover" />
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
};

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

const listenToUsers = () => {
  const usersRef = dbRef(database, 'Users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      usersProfile.value = data;
      
      // Update my own marker and form if profile updated remotely
      if (usersProfile.value[userId]) {
         profileForm.value = { ...profileForm.value, ...usersProfile.value[userId] };
         if (userMarker) {
            userMarker.setIcon(getUserIcon(userId, true));
            userMarker.setPopupContent(`<div class="font-bold text-gray-800">${profileForm.value.Name || 'Bạn đang ở đây'}</div>`);
         }
      }

      // Update existing other markers icons dynamically
      Object.keys(otherMarkers).forEach(id => {
        otherMarkers[id].setIcon(getUserIcon(id, false));
        const name = usersProfile.value[id]?.Name || `Người ấy (${id.substring(0, 8)})`;
        otherMarkers[id].setPopupContent(`<div class="font-bold text-gray-800">${name}</div>`);
      });
    }
  });
};

const listenToLocations = () => {
  const locationsRef = dbRef(database, 'Live_Locations');
  onValue(locationsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Check all users
    Object.keys(data).forEach((key) => {
      const user = data[key];
      if (user.ID_user === userId) return; // Skip own location

      const latLng = [user.Lat, user.Lng];
      const name = usersProfile.value[user.ID_user]?.Name || `Người ấy (${user.ID_user.substring(0, 8)})`;

      if (otherMarkers[user.ID_user]) {
        otherMarkers[user.ID_user].setLatLng(latLng);
      } else {
        const newMarker = L.marker(latLng, { icon: getUserIcon(user.ID_user, false) }).addTo(map);
        newMarker.bindPopup(`<div class="font-bold text-gray-800">${name}</div>`);
        otherMarkers[user.ID_user] = newMarker;
      }
    });
  });
};

onMounted(() => {
  // Fetch initial profile so form is populated
  fetchMyProfile();

  map = L.map('map', {
    zoomControl: false 
  }).setView([10.8231, 106.6297], 13);

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps',
    maxZoom: 19
  }).addTo(map);

  // Listen to profile updates and location updates
  listenToUsers();
  listenToLocations();

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      currentLocation.value = { lat: latitude, lng: longitude };
      
      if (!userMarker) {
        map.setView([latitude, longitude], 16);
        userMarker = L.marker([latitude, longitude], { icon: getUserIcon(userId, true) }).addTo(map);
        
        const myName = profileForm.value.Name || 'Bạn đang ở đây';
        userMarker.bindPopup(`<div class="font-bold text-gray-800">${myName}</div>`).openPopup();
        
        // --- Click on own avatar opens profile modal ---
        userMarker.on('click', () => {
          showProfileModal.value = true;
        });

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
