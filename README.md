# 🎙️ Realtime Voice Chat App (Work in Progress)

![Status](https://img.shields.io/badge/Status-Work%20in%20Progress-yellow)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![WebRTC](https://img.shields.io/badge/Realtime-WebRTC-orange?logo=webrtc)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

This repository contains my ongoing work on building a **scalable realtime voice chat application** inspired by platforms like Twitter Spaces / Clubhouse.  
The goal is to design a robust system that can scale to **millions of users** while providing smooth realtime communication.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (with Redux Toolkit for state management)
- **RTK Query** for API integration
- **WebRTC** for peer-to-peer audio streaming
- **TailwindCSS / Chakra UI** (for UI)

### Backend
- **Node.js + Express.js**
- **MongoDB** (user, rooms, and profile data)
- **Redis** (caching + pub/sub for socket scaling)
- **Socket.IO** (signaling + realtime presence)
- **WebRTC** (voice communication)
- **TURN/STUN servers** for NAT traversal
- (Future) **SFU** (e.g., mediasoup/LiveKit) for scaling audio rooms

---

## 📌 Planned Features

### 🔐 Authentication
- OTP-based login (via **phone/email**)  
- User profile (full name, profile picture, username, followers/following)

### 🎧 Rooms
- **Public Rooms** → Visible & joinable by any authenticated user  
- **Closed Rooms** → Join via invite link only  
- **Roles**:  
  - **Speakers** → Can mute/unmute themselves, choose mic device  
  - **Listeners** → Join in listen-only mode  
- Room creator can:
  - Add/remove speakers  
  - Delete room  

### 👤 Profile
- Profile page with **followers/following count**  
- Ability to explore rooms & users  

---

## 🏗️ Project Status
- ✅ Tech stack finalized  
- ✅ Initial architecture & backend setup  
- ⏳ Working on **authentication & room management APIs**  
- ⏳ Next step: **WebRTC integration for realtime audio**  

---

## 📂 Repository Structure (Planned)

```
/client     → React frontend (Redux + RTK Query)
/server     → Node.js backend (Express + Socket.IO)
/shared     → Shared types, utils, configs
/docker     → Dev setup with MongoDB + Redis
```

---

## 🔮 Roadmap
- [ ] User Authentication with OTP (Phone/Email)  
- [ ] Room creation/joining APIs  
- [ ] Socket.IO + WebRTC signaling  
- [ ] TURN/STUN server integration  
- [ ] Profile + Followers/Following  
- [ ] Docker/Kubernetes deployment setup  
- [ ] Scaling with SFU (mediasoup / LiveKit)  

---

## 🤝 Contributions
This is currently an **individual project** I’m working on.  
Once the core features are stable, I plan to open it for contributions.  

---

## 📢 Note
This project is under **active development**. Features may change as the architecture evolves. Stay tuned 🚀  
