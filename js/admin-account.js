/* ================================================================
   LITTLEMAKER CAMBODIA — admin-account.js
   Module: Account & Users Management (Profile, Avatar, Bio)
   ================================================================ */

'use strict';

// គ្រប់គ្រងការ Upload រូបភាព Profile
window.handleProfImg = function(input) {
  const file = input.files[0]; 
  if(!file) return;
  
  if (window.compressImage) {
    window.compressImage(file, (base64) => {
      document.getElementById('profImgSrc').value = base64;
      document.getElementById('profImgPrev').src = base64;
      document.getElementById('profImgPrev').classList.add('show');
      document.getElementById('profImgPh').style.display = 'none';
    });
  } else {
     console.error("compressImage function is missing!");
  }
};

// ទាញយកព័ត៌មានគណនីពី Firebase មកបង្ហាញក្នុង Form
window.loadProfile = async function() {
  if (!window.currentUser || !window.currentUser.uid) return;
  try {
    if (window.firestoreDB) {
        const docSnap = await window.fsGetDoc(window.fsDoc(window.firestoreDB, "users", window.currentUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          document.getElementById('profName').value = data.name || window.currentUser.name;
          document.getElementById('profPhone').value = data.phone || '';
          document.getElementById('profBio').value = data.bio || '';
          
          if (data.photoURL) {
            document.getElementById('profImgSrc').value = data.photoURL;
            document.getElementById('profImgPrev').src = data.photoURL;
            document.getElementById('profImgPrev').classList.add('show');
            document.getElementById('profImgPh').style.display = 'none';
            document.getElementById('sbAv').innerHTML = `<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`;
          } else {
            document.getElementById('sbAv').innerHTML = (data.name || window.currentUser.name).charAt(0).toUpperCase();
          }
          
          document.getElementById('sbName').textContent = data.name || window.currentUser.name;
          document.getElementById('sbRole').textContent = data.bio || 'Administrator';
          return;
        }
    }
    
    // លំនាំដើម បើមិនទាន់មានទិន្នន័យក្នុង Firebase
    document.getElementById('profName').value = window.currentUser.name;
    document.getElementById('sbAv').innerHTML = window.currentUser.name.charAt(0).toUpperCase();
    document.getElementById('sbName').textContent = window.currentUser.name;
    
  } catch (e) {
    console.error("Error loading profile", e);
  }
};

// រក្សាទុកព័ត៌មានគណនីទៅ Firebase វិញ
window.saveProfile = async function() {
  const btn = document.getElementById('btnSaveProf');
  if(!btn) return;
  const og = btn.innerHTML; 
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> កំពុងរក្សាទុក...'; 
  btn.disabled = true;
  
  try {
    const name = document.getElementById('profName').value.trim();
    const phone = document.getElementById('profPhone').value.trim();
    const bio = document.getElementById('profBio').value.trim();
    const photoURL = document.getElementById('profImgSrc').value;
    
    if(window.firestoreDB && window.currentUser && window.currentUser.uid) {
        await window.fsSetDoc(window.fsDoc(window.firestoreDB, "users", window.currentUser.uid), {
          name, phone, bio, photoURL, updatedAt: new Date().toISOString()
        }, { merge: true });
    }
    
    document.getElementById('sbName').textContent = name || 'Admin';
    document.getElementById('sbRole').textContent = bio || 'Administrator';
    
    if (photoURL) {
      document.getElementById('sbAv').innerHTML = `<img src="${photoURL}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      document.getElementById('sbAv').innerHTML = (name || 'A').charAt(0).toUpperCase();
    }
    
    if(window.toast) window.toast('រក្សាទុកគណនីជោគជ័យ!', 'success');
    if(window.logActivity) window.logActivity('save', 'Updated user profile');
  } catch(e) {
    if(window.toast) window.toast('មានបញ្ហាក្នុងការរក្សាទុក', 'error');
    console.error(e);
  } finally {
    btn.innerHTML = og; 
    btn.disabled = false;
  }
};