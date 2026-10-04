<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Map Container -->
    <div id="map" class="w-full h-full z-0"></div>
    
    <!-- Floating Header -->
    <div v-if="!showAuthModal" class="absolute top-6 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
      <div class="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-white/50 pointer-events-auto flex items-center space-x-3">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        <span class="font-bold text-gray-800 tracking-wide">Live Location</span>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div v-if="!showAuthModal" class="absolute bottom-8 right-6 z-[1000] flex flex-col space-y-4">
      <!-- Mailbox Button -->
      <button @click="showMailboxModal = true" class="bg-white p-4 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-colors relative" title="Hòm thư">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span v-if="totalUnread > 0" class="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">{{ totalUnread }}</span>
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

    <!-- Auth Modal -->
    <div v-if="showAuthModal" class="absolute inset-0 z-[6000] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 transform transition-all">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-12 shadow-inner ring-4 ring-purple-50">
            <svg class="w-8 h-8 -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">{{ isLoginMode ? 'Đăng Nhập' : 'Tạo Tài Khoản' }}</h2>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">Kết nối cùng người ấy<br/>Đồng bộ mọi thiết bị</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tên đăng nhập</label>
            <input v-model="authForm.username" @keyup.enter="handleAuth" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium text-gray-800" placeholder="Viết liền không dấu...">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <input v-model="authForm.password" @keyup.enter="handleAuth" type="password" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="••••••••">
          </div>
        </div>
        
        <button @click="handleAuth" class="w-full mt-8 px-4 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-bold shadow-lg shadow-purple-500/30 transition-transform active:scale-95 flex justify-center items-center">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isLoginMode ? 'Vào Bản Đồ' : 'Đăng Ký Ngay' }}
        </button>
        
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-500">{{ isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}</span>
          <button @click="isLoginMode = !isLoginMode" class="ml-1 text-purple-600 font-bold hover:underline transition-all">
            {{ isLoginMode ? 'Đăng ký' : 'Đăng nhập' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mailbox Modal -->
    <div v-if="showMailboxModal" class="absolute inset-0 z-[4000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity" @click.self="showMailboxModal = false">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all flex flex-col max-h-[80vh]">
        <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 class="text-xl font-bold text-gray-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
            Hòm Thư
          </h2>
          <button @click="showMailboxModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="overflow-y-auto flex-1 p-2">
          <div v-if="Object.keys(chatPreviews).length === 0" class="p-8 text-center text-gray-400 text-sm">
            Chưa có đoạn hội thoại nào.
          </div>
          <div v-for="(chat, id) in chatPreviews" :key="id" @click="openChatFromMailbox(id)" class="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors relative">
            <img :src="getUserImg(id)" class="w-12 h-12 rounded-full border border-gray-200 object-cover mr-4 shadow-sm" />
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-baseline mb-1">
                <h3 class="font-bold text-gray-800 text-sm truncate pr-2" :class="{'text-purple-600': chat.unread}">{{ usersProfile[id]?.Name || 'Người ấy' }}</h3>
                <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ formatTime(chat.time) }}</span>
              </div>
              <p class="text-xs truncate" :class="chat.unread ? 'text-gray-800 font-semibold' : 'text-gray-500'">{{ chat.lastMessage }}</p>
            </div>
            <div v-if="chat.unread" class="w-2.5 h-2.5 bg-red-500 rounded-full ml-3 shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="showProfileModal" class="absolute inset-0 z-[5000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
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

          <div class="mt-8 flex flex-col space-y-3">
            <button @click="saveProfile" class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98]">
              Lưu Thông Tin
            </button>
            <button @click="logout" class="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-semibold transition-colors">
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Panel -->
    <div :class="showChatPanel ? 'translate-x-0' : 'translate-x-full'" class="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[3000] transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200">
      <!-- Chat Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
        <h2 class="font-bold text-lg flex items-center">
          <div class="relative mr-3">
             <img v-if="chatPartnerId" :src="getUserImg(chatPartnerId)" class="w-8 h-8 rounded-full border border-white/50 object-cover bg-white" />
          </div>
          Chat với {{ chatPartnerId ? (usersProfile[chatPartnerId]?.Name || 'Người ấy') : '' }}
        </h2>
        <button @click="closeChat" class="text-white/80 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 flex flex-col overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/95">
        <div class="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col scroll-smooth" id="chat-messages-container">
          <div v-if="messages.length === 0" class="m-auto text-center text-gray-400 text-sm">
            Chưa có tin nhắn nào.<br/>Hãy gửi lời chào đầu tiên!
          </div>
          <div v-for="msg in messages" :key="msg.ID_message" :class="['flex w-full', msg.User_sender === userId ? 'justify-end' : 'justify-start']">
            <div class="flex max-w-[85%] items-end space-x-2" :class="{'flex-row-reverse space-x-reverse': msg.User_sender === userId}">
              <img :src="getUserImg(msg.User_sender)" class="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm bg-white flex-shrink-0" />
              <div class="flex flex-col" :class="msg.User_sender === userId ? 'items-end' : 'items-start'">
                <div :class="['px-4 py-2.5 shadow-sm relative group', msg.User_sender === userId ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-sm' : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100']">
                  <!-- Handle Image -->
                  <div v-if="msg.IsImage" class="mt-1 mb-1">
                     <img :src="msg.decryptedText" @click="openImageModal(msg.decryptedText)" class="max-w-[200px] sm:max-w-[250px] rounded-xl object-contain shadow-sm cursor-pointer hover:opacity-90 transition-opacity" />
                  </div>
                  <!-- Handle Text -->
                  <p v-else class="text-[15px] leading-relaxed break-words">{{ msg.decryptedText }}</p>
                  
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
        <div class="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] relative">
          <!-- Image loading overlay inside input area -->
          <div v-if="isUploadingChatImage" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center text-purple-600 font-semibold text-sm">
             <svg class="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             Đang gửi ảnh...
          </div>
          
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="relative flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-full focus-within:ring-2 focus-within:ring-purple-500 transition-all overflow-hidden">
              <label class="cursor-pointer pl-4 pr-2 py-3 text-gray-400 hover:text-purple-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <input type="file" class="hidden" accept="image/*" @change="handleChatImageUpload" :disabled="isUploadingChatImage">
              </label>
              
              <input v-model="newMessage" @keyup.enter="sendMessage" type="text" class="w-full pr-4 py-3.5 bg-transparent outline-none text-[15px]" placeholder="Nhắn tin...">
            </div>
            
            <button @click="sendMessage" class="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100" :disabled="!newMessage.trim()">
              <svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Image Viewer Modal -->
    <div v-if="selectedImageUrl" class="absolute inset-0 z-[7000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-opacity" @click="selectedImageUrl = null">
      <button @click="selectedImageUrl = null" class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <img :src="selectedImageUrl" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform scale-100 transition-transform duration-300" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick, computed } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { database } from '../firebase';
import { ref as dbRef, set, onValue, get, off } from 'firebase/database';
import CryptoJS from 'crypto-js';

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

// --- Auth State ---
const userId = ref(localStorage.getItem('couple_map_user_id') || '');
const showAuthModal = ref(!userId.value);
const isLoginMode = ref(true);
const isLoading = ref(false);
const authForm = ref({ username: '', password: '' });

// --- Mailbox State ---
const showMailboxModal = ref(false);
const chatPreviews = ref({});
const chatListeners = {};
const totalUnread = computed(() => Object.values(chatPreviews.value).filter(c => c.unread).length);

// --- Direct Chat State ---
const showChatPanel = ref(false);
const chatPartnerId = ref('');
const messages = ref([]);
const newMessage = ref('');
const chatId = ref('');
const isUploadingChatImage = ref(false);
const selectedImageUrl = ref(null);

// ==============================
// AUTH LOGIC
// ==============================
const handleAuth = async () => {
   if(!authForm.value.username || !authForm.value.password) {
      alert("Vui lòng nhập đủ tên đăng nhập và mật khẩu!");
      return;
   }
   
   const safeUsername = authForm.value.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
   if(!safeUsername || safeUsername.length < 3) {
      alert("Tên đăng nhập không hợp lệ (nhập ít nhất 3 ký tự gồm chữ không dấu, số hoặc _)");
      return;
   }
   
   isLoading.value = true;
   try {
      const hashedPass = CryptoJS.SHA256(authForm.value.password).toString();
      const userRef = dbRef(database, `Users/${safeUsername}`);
      const snap = await get(userRef);
      
      if(isLoginMode.value) {
         if(!snap.exists()) {
            alert("Tài khoản không tồn tại!");
            return;
         }
         const data = snap.val();
         if(data.Password !== hashedPass) {
            alert("Sai mật khẩu!");
            return;
         }
         // Login success
         loginSuccess(safeUsername);
      } else {
         if(snap.exists()) {
            alert("Tên đăng nhập đã có người sử dụng!");
            return;
         }
         // Register success
         await set(userRef, {
            ID_user: safeUsername,
            Password: hashedPass,
            Name: safeUsername,
         });
         loginSuccess(safeUsername);
      }
   } catch (e) {
      alert("Lỗi kết nối máy chủ");
   } finally {
      isLoading.value = false;
   }
};

const loginSuccess = (uname) => {
   userId.value = uname;
   localStorage.setItem('couple_map_user_id', uname);
   showAuthModal.value = false;
   initializeApp();
};

const logout = () => {
   localStorage.removeItem('couple_map_user_id');
   location.reload();
};


// ==============================
// CHAT LOGIC (1-on-1 Direct)
// ==============================
const markAsRead = (targetId) => {
  const lastSeenRef = dbRef(database, `Users/${userId.value}/LastSeen/${targetId}`);
  set(lastSeenRef, Date.now());
  
  if(chatPreviews.value[targetId]) {
    chatPreviews.value[targetId].unread = false;
  }
};

window.openChatWith = (targetId) => {
  chatPartnerId.value = targetId;
  chatId.value = [userId.value, targetId].sort().join('_');
  showChatPanel.value = true;
  markAsRead(targetId);
  listenToMessages();
};

const openChatFromMailbox = (targetId) => {
  showMailboxModal.value = false;
  window.openChatWith(targetId);
};

const closeChat = () => {
  showChatPanel.value = false;
  if(chatId.value) {
    const messagesRef = dbRef(database, `Chats/${chatId.value}/Messages`);
    off(messagesRef);
  }
};

const listenToMessages = () => {
  const messagesRef = dbRef(database, `Chats/${chatId.value}/Messages`);
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      messages.value = [];
      return;
    }
    
    const msgs = Object.keys(data).map(key => {
      const msg = data[key];
      let decryptedText = 'Tin nhắn lỗi';
      try {
        const bytes = CryptoJS.AES.decrypt(msg.Message_text, chatId.value);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if(originalText) decryptedText = originalText;
      } catch (e) {
        decryptedText = msg.Message_text; 
      }
      return { ...msg, decryptedText };
    }).sort((a, b) => a.Time - b.Time);
    
    messages.value = msgs;
    
    if (showChatPanel.value && chatPartnerId.value) {
      markAsRead(chatPartnerId.value);
    }
    
    nextTick(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    });
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !chatId.value) return;
  const msgId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  const newMsgRef = dbRef(database, `Chats/${chatId.value}/Messages/${msgId}`);
  
  const encrypted = CryptoJS.AES.encrypt(newMessage.value.trim(), chatId.value).toString();
  
  set(newMsgRef, {
    ID_message: msgId,
    User_sender: userId.value,
    Message_text: encrypted,
    IsImage: false,
    Time: Date.now(),
    Location: currentLocation.value ? { lat: currentLocation.value.lat, lng: currentLocation.value.lng } : null
  });
  
  newMessage.value = '';
};

const handleChatImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !chatId.value) return;

  isUploadingChatImage.value = true;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload?key=b202a4bdc79bf1dc72f6f6ded6b74501', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      const msgId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      const newMsgRef = dbRef(database, `Chats/${chatId.value}/Messages/${msgId}`);
      
      const encrypted = CryptoJS.AES.encrypt(data.data.url, chatId.value).toString();
      
      set(newMsgRef, {
        ID_message: msgId,
        User_sender: userId.value,
        Message_text: encrypted,
        IsImage: true,
        Time: Date.now(),
        Location: currentLocation.value ? { lat: currentLocation.value.lat, lng: currentLocation.value.lng } : null
      });
    } else {
      alert('Tải ảnh lên thất bại, vui lòng thử lại.');
    }
  } catch (error) {
    alert('Có lỗi xảy ra khi tải ảnh lên.');
  } finally {
    isUploadingChatImage.value = false;
    event.target.value = '';
  }
};

const openImageModal = (url) => {
  selectedImageUrl.value = url;
};

const formatTime = (ts) => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const jumpToLocation = (loc) => {
  if (map && loc) {
    map.flyTo([loc.lat, loc.lng], 18, { duration: 1.5 });
    if (window.innerWidth < 640) showChatPanel.value = false; 
  }
};

const getUserImg = (id) => {
  if(!id) return '';
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
      alert('Tải ảnh lên thất bại, vui lòng thử lại.');
    }
  } catch (error) {
    alert('Có lỗi xảy ra khi tải ảnh lên.');
  } finally {
    isUploading.value = false;
  }
};

const fetchMyProfile = async () => {
  const profileRef = dbRef(database, 'Users/' + userId.value);
  const snap = await get(profileRef);
  if (snap.exists()) {
    profileForm.value = { ...profileForm.value, ...snap.val() };
  }
};

const saveProfile = async () => {
  const profileRef = dbRef(database, 'Users/' + userId.value);
  const snap = await get(profileRef);
  let oldPass = '';
  if (snap.exists()) oldPass = snap.val().Password || '';

  await set(profileRef, {
    ID_user: userId.value,
    Password: oldPass, // Preserve password
    Name: profileForm.value.Name,
    Phone: profileForm.value.Phone,
    Img: profileForm.value.Img
  });
  showProfileModal.value = false;
  
  if (userMarker) {
    userMarker.setIcon(getUserIcon(userId.value, true));
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
  const locationRef = dbRef(database, 'Live_Locations/' + userId.value);
  set(locationRef, {
    ID_user: userId.value,
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
      
      if (usersProfile.value[userId.value]) {
         profileForm.value = { ...profileForm.value, ...usersProfile.value[userId.value] };
         if (userMarker) {
            userMarker.setIcon(getUserIcon(userId.value, true));
            userMarker.setPopupContent(`<div class="font-bold text-gray-800">${profileForm.value.Name || 'Bạn đang ở đây'}</div>`);
         }
      }

      Object.keys(usersProfile.value).forEach(id => {
        if(id === userId.value) return;
        
        // Setup mailbox listeners dynamically
        const cid = [userId.value, id].sort().join('_');
        if(!chatListeners[cid]) {
           chatListeners[cid] = true;
           onValue(dbRef(database, `Chats/${cid}/Messages`), snapshot => {
              const chatData = snapshot.val();
              if(chatData) {
                 const msgs = Object.values(chatData).sort((a,b) => a.Time - b.Time);
                 const lastMsg = msgs[msgs.length - 1];
                 
                 let decText = "Tin nhắn";
                 try {
                    const bytes = CryptoJS.AES.decrypt(lastMsg.Message_text, cid);
                    const original = bytes.toString(CryptoJS.enc.Utf8);
                    if(original) decText = original;
                 } catch(e) {}
                 
                 if (lastMsg.IsImage) {
                    decText = "[Hình ảnh]";
                 }
                 
                 let isUnread = false;
                 if (lastMsg.User_sender === id) {
                    const myLastSeen = usersProfile.value[userId.value]?.LastSeen?.[id] || 0;
                    if (lastMsg.Time > myLastSeen) {
                       if (showChatPanel.value && chatPartnerId.value === id) {
                          markAsRead(id);
                       } else {
                          isUnread = true;
                       }
                    }
                 }

                 chatPreviews.value = {
                    ...chatPreviews.value,
                    [id]: {
                       lastMessage: decText,
                       time: lastMsg.Time,
                       unread: isUnread
                    }
                 };
              }
           });
        }
        
        // Update marker UI
        if(otherMarkers[id]) {
            otherMarkers[id].setIcon(getUserIcon(id, false));
            const name = usersProfile.value[id]?.Name || `Người ấy (${id.substring(0, 8)})`;
            otherMarkers[id].setPopupContent(`
              <div class="text-center">
                <div class="font-bold text-gray-800 text-sm mb-2">${name}</div>
                <button onclick="window.openChatWith('${id}')" class="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transform active:scale-95 transition-all">
                  💬 Nhắn tin ngay
                </button>
              </div>
            `);
        }
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
      if (user.ID_user === userId.value) return;

      const latLng = [user.Lat, user.Lng];
      const name = usersProfile.value[user.ID_user]?.Name || `Người ấy (${user.ID_user.substring(0, 8)})`;

      if (otherMarkers[user.ID_user]) {
        otherMarkers[user.ID_user].setLatLng(latLng);
      } else {
        const newMarker = L.marker(latLng, { icon: getUserIcon(user.ID_user, false) }).addTo(map);
        newMarker.bindPopup(`
          <div class="text-center">
            <div class="font-bold text-gray-800 text-sm mb-2">${name}</div>
            <button onclick="window.openChatWith('${user.ID_user}')" class="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transform active:scale-95 transition-all">
              💬 Nhắn tin ngay
            </button>
          </div>
        `);
        otherMarkers[user.ID_user] = newMarker;
      }
    });
  });
};

const initializeApp = () => {
  fetchMyProfile();

  listenToUsers();
  listenToLocations();

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      currentLocation.value = { lat: latitude, lng: longitude };
      
      if (!userMarker) {
        map.setView([latitude, longitude], 16);
        userMarker = L.marker([latitude, longitude], { icon: getUserIcon(userId.value, true) }).addTo(map);
        
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
};

onMounted(() => {
  map = L.map('map', {
    zoomControl: false 
  }).setView([10.8231, 106.6297], 13);

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: '&copy; Google Maps',
    maxZoom: 19
  }).addTo(map);
  
  if (userId.value) {
     initializeApp();
  }
});

onUnmounted(() => {
  if (map) map.remove();
  delete window.openChatWith;
});
</script>

<style>
.leaflet-popup-content-wrapper {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  padding: 8px;
}
.leaflet-popup-tip-container {
  margin-top: -1px;
}
.leaflet-container {
  font-family: inherit;
  z-index: 0;
}
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
