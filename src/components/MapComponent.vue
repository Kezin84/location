<template>
  <div class="relative w-full h-full overflow-hidden">
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
      <!-- Chat Button -->
      <button @click="openChat" class="bg-white p-4 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-colors relative" title="Nhắn tin">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span v-if="unreadCount > 0" class="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">{{ unreadCount }}</span>
      </button>

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

    <!-- Chat Panel -->
    <div :class="showChatPanel ? 'translate-x-0' : 'translate-x-full'" class="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[3000] transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200">
      <!-- Chat Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
        <h2 class="font-bold text-lg flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Chat Mật Mã
        </h2>
        <button @click="showChatPanel = false" class="text-white/80 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Auth State -->
      <div v-if="!chatSecret" class="flex-1 p-6 flex flex-col justify-center bg-gray-50">
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-purple-50">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800">Mật mã cặp đôi</h3>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">Tin nhắn được mã hóa End-to-End.<br/>Hãy nhập chung 1 mật mã bí mật để vào chung phòng chat.</p>
        </div>
        <input v-model="tempSecret" @keyup.enter="joinChat" type="password" class="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all mb-4 text-center text-xl tracking-[0.3em] shadow-sm font-mono placeholder:tracking-normal" placeholder="Bí mật...">
        <button @click="joinChat" class="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-700 font-semibold shadow-lg shadow-purple-500/30 transition-all transform active:scale-[0.98]">
          Mở Khóa Phòng Chat
        </button>
      </div>

      <!-- Chat Messages -->
      <div v-else class="flex-1 flex flex-col overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/95">
        <div class="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scroll-smooth" id="chat-messages-container">
          <div v-if="messages.length === 0" class="m-auto text-center text-gray-400 text-sm">
            Chưa có tin nhắn nào.<br/>Người ấy sẽ thấy tin nhắn nếu nhập đúng mật mã.
          </div>
          <div v-for="msg in messages" :key="msg.ID_message" :class="['flex w-full', msg.User_sender === userId ? 'justify-end' : 'justify-start']">
            <div class="flex max-w-[85%] items-end space-x-2" :class="{'flex-row-reverse space-x-reverse': msg.User_sender === userId}">
              <img :src="getUserImg(msg.User_sender)" class="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm bg-white flex-shrink-0" />
              <div class="flex flex-col" :class="msg.User_sender === userId ? 'items-end' : 'items-start'">
                <span v-if="msg.User_sender !== userId" class="text-[10px] text-gray-500 mb-1 ml-1 font-medium">{{ usersProfile[msg.User_sender]?.Name || 'Người ấy' }}</span>
                <div :class="['px-4 py-2.5 shadow-sm relative group', msg.User_sender === userId ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-sm' : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100']">
                  <p class="text-[15px] leading-relaxed break-words">{{ msg.decryptedText }}</p>
                  
                  <div class="text-[10px] mt-1.5 flex justify-between items-center gap-2" :class="msg.User_sender === userId ? 'text-purple-200' : 'text-gray-400'">
                    <span>{{ formatTime(msg.Time) }}</span>
                    <!-- Location Jump Button -->
                    <button v-if="msg.Location" @click="jumpToLocation(msg.Location)" class="hover:text-current transition-colors opacity-60 hover:opacity-100" title="Đến vị trí lúc gửi tin nhắn này">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input Area -->
        <div class="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div class="flex items-center space-x-3">
            <div class="relative flex-1">
              <input v-model="newMessage" @keyup.enter="sendMessage" type="text" class="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-[15px]" placeholder="Nhắn tin an toàn...">
            </div>
            <button @click="sendMessage" class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100" :disabled="!newMessage.trim()">
              <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="absolute inset-0 z-[4000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
        <div class="px-6 py-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Hồ Sơ Của Bạn</h2>
            <button @click="showProfileModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
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
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { database } from '../firebase';
import { ref as dbRef, set, onValue, get } from 'firebase/database';
import CryptoJS from 'crypto-js';

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

// --- Chat State ---
const showChatPanel = ref(false);
const chatSecret = ref(localStorage.getItem('couple_chat_secret') || '');
const tempSecret = ref('');
const messages = ref([]);
const newMessage = ref('');
const chatId = ref('');
const unreadCount = ref(0);
let isFirstLoad = true;

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

// ==============================
// CHAT & SECURITY LOGIC
// ==============================
const openChat = () => {
  showChatPanel.value = true;
  unreadCount.value = 0;
  if(chatSecret.value && !chatId.value) {
     // auto join if already saved
     tempSecret.value = chatSecret.value;
     joinChat();
  }
};

const joinChat = () => {
  if (!tempSecret.value.trim()) return;
  chatSecret.value = tempSecret.value.trim();
  localStorage.setItem('couple_chat_secret', chatSecret.value);
  chatId.value = CryptoJS.SHA256(chatSecret.value).toString();
  listenToMessages();
};

const listenToMessages = () => {
  const messagesRef = dbRef(database, `Chats/${chatId.value}/Messages`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    
    const msgs = Object.keys(data).map(key => {
      const msg = data[key];
      let decryptedText = 'Mật mã sai hoặc tin nhắn lỗi';
      try {
        const bytes = CryptoJS.AES.decrypt(msg.Message_text, chatSecret.value);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if(originalText) decryptedText = originalText;
      } catch (e) {}
      return { ...msg, decryptedText };
    }).sort((a, b) => a.Time - b.Time);
    
    messages.value = msgs;
    
    // Unread count logic
    if (!isFirstLoad && !showChatPanel.value) {
      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg && lastMsg.User_sender !== userId) {
        unreadCount.value++;
      }
    }
    isFirstLoad = false;
    
    // Auto scroll to bottom
    nextTick(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    });
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  const msgId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  const newMsgRef = dbRef(database, `Chats/${chatId.value}/Messages/${msgId}`);
  
  // Encrypt message E2E before sending
  const encrypted = CryptoJS.AES.encrypt(newMessage.value.trim(), chatSecret.value).toString();
  
  set(newMsgRef, {
    ID_message: msgId,
    User_sender: userId,
    Message_text: encrypted,
    Time: Date.now(),
    Location: currentLocation.value ? { lat: currentLocation.value.lat, lng: currentLocation.value.lng } : null
  });
  
  newMessage.value = '';
};

const formatTime = (ts) => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const jumpToLocation = (loc) => {
  if (map && loc) {
    map.flyTo([loc.lat, loc.lng], 18, { duration: 1.5 });
    // optionally close chat panel to see map
    if (window.innerWidth < 640) showChatPanel.value = false; 
  }
};

const getUserImg = (id) => {
  const profile = usersProfile.value[id];
  return profile?.Img ? profile.Img : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
};

// ==============================
// PROFILE & MAP LOGIC
// ==============================
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
  
  if (userMarker) {
    userMarker.setIcon(getUserIcon(userId, true));
    userMarker.setPopupContent(`<div class="font-bold text-gray-800">${profileForm.value.Name || 'Bạn đang ở đây'}</div>`);
  }
};

const getUserIcon = (id, isCurrentUser = false) => {
  const bgColor = isCurrentUser ? 'bg-blue-500' : 'bg-pink-500';
  const profile = usersProfile.value[id] || {};
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
      
      if (usersProfile.value[userId]) {
         profileForm.value = { ...profileForm.value, ...usersProfile.value[userId] };
         if (userMarker) {
            userMarker.setIcon(getUserIcon(userId, true));
            userMarker.setPopupContent(`<div class="font-bold text-gray-800">${profileForm.value.Name || 'Bạn đang ở đây'}</div>`);
         }
      }

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

    Object.keys(data).forEach((key) => {
      const user = data[key];
      if (user.ID_user === userId) return;

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
  fetchMyProfile();
  
  if (chatSecret.value) {
    // If they previously logged in, start listening quietly
    chatId.value = CryptoJS.SHA256(chatSecret.value).toString();
    listenToMessages();
  }

  map = L.map('map', {
    zoomControl: false 
  }).setView([10.8231, 106.6297], 13);

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps',
    maxZoom: 19
  }).addTo(map);

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
/* Custom Scrollbar for Chat */
#chat-messages-container::-webkit-scrollbar {
  width: 6px;
}
#chat-messages-container::-webkit-scrollbar-track {
  background: transparent;
}
#chat-messages-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>
