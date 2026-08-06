// notes.js — birthdate login gate + shared notes board (Firebase Firestore)

// ---------- Firebase setup ----------
const firebaseConfig = {
  apiKey: "AIzaSyDjzz-8YwOkfaagm7MJ40qdpKe73ssjBEg",
  authDomain: "our-monthsary.firebaseapp.com",
  projectId: "our-monthsary",
  storageBucket: "our-monthsary.firebasestorage.app",
  messagingSenderId: "663228798330",
  appId: "1:663228798330:web:0a2dbde1333f4188b2f2c3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Photo uploads go to ImgBB instead of Firebase Storage, since Firebase
// Storage now requires the paid Blaze plan (a linked billing account) even
// for free-tier usage. ImgBB is free with just an API key, no card needed.
// NOTE: this key is visible in the page source, same as the Firebase config
// above — fine for a small personal site, not something to reuse on a
// larger/public project.
const IMGBB_API_KEY = "e2c0cc00845c78e1557e2b3e766ce374";

const MAX_PHOTO_BYTES = 25 * 1024 * 1024; // 25MB (ImgBB's real cap is 32MB; the canvas resize step below shrinks most photos well under this anyway)
let selectedPhotoFile = null;

// ---------- Accounts ----------
// Account names only live here. Passwords/security Q&A live in Firestore
// (collection "accounts", docs "aren" and "ica") so they can be reset.
const ACCOUNT_NAMES = {
  aren: "Aren",
  ica: "Ica"
};

const STORAGE_KEY = "monthsaryUser";

let currentUser = null;        // { key, name, isGuest }
let selectedAccountKey = null; // used while stepping through login/forgot flow
let accountsCache = {};        // { key: { password, securityQuestion, securityAnswer } }

// SECURITY NOTE: passwords are checked client-side against data pulled from
// Firestore, and the Firestore config/API key below is necessarily public in
// the page source. That means a visitor who opens devtools can read
// `accountsCache` (or query Firestore directly) and see both passwords in
// plaintext. This is fine for "keep casual visitors out" but is NOT real
// authentication. A proper fix means moving login to Firebase Authentication
// (email/password or custom token) with Firestore security rules that check
// request.auth — that requires changes on the Firebase project side, not
// just this file. Flagging it here rather than leaving it undocumented.
async function fetchAccount(key) {
  if (accountsCache[key]) return accountsCache[key];
  const doc = await db.collection("accounts").doc(key).get();
  if (!doc.exists) return null;
  accountsCache[key] = doc.data();
  return accountsCache[key];
}

// ---------- Login gate UI ----------
function selectAccount(key) {
  selectedAccountKey = key;
  document.getElementById("loginSelectedName").textContent = ACCOUNT_NAMES[key];
  document.getElementById("loginError").classList.add("hidden");
  document.getElementById("loginPasswordInput").value = "";
  document.getElementById("loginStepAccounts").classList.add("hidden");
  document.getElementById("loginStepPassword").classList.remove("hidden");
}

function showAccountStep() {
  selectedAccountKey = null;
  hideAllLoginSteps();
  document.getElementById("loginStepAccounts").classList.remove("hidden");
}

function showPasswordStep() {
  hideAllLoginSteps();
  document.getElementById("loginError").classList.add("hidden");
  document.getElementById("loginPasswordInput").value = "";
  document.getElementById("loginStepPassword").classList.remove("hidden");
}

function hideAllLoginSteps() {
  ["loginStepAccounts", "loginStepPassword", "loginStepForgot", "loginStepReset"].forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
}

async function attemptLogin() {
  const input = document.getElementById("loginPasswordInput");
  const entered = input.value;
  const account = await fetchAccount(selectedAccountKey);

  if (account && entered && entered === account.password) {
    loginSuccess(selectedAccountKey, false);
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
}

async function showForgotStep() {
  hideAllLoginSteps();
  document.getElementById("loginForgotError").classList.add("hidden");
  document.getElementById("loginSecurityAnswerInput").value = "";
  const questionEl = document.getElementById("loginSecurityQuestion");
  questionEl.textContent = "Loading question...";
  document.getElementById("loginStepForgot").classList.remove("hidden");

  const account = await fetchAccount(selectedAccountKey);
  questionEl.textContent = (account && account.securityQuestion)
    ? account.securityQuestion
    : "No security question is set up for this account yet.";
}

async function checkSecurityAnswer() {
  const input = document.getElementById("loginSecurityAnswerInput");
  const entered = input.value.trim().toLowerCase();
  const account = await fetchAccount(selectedAccountKey);
  const correct = (account && account.securityAnswer || "").trim().toLowerCase();

  if (entered && correct && entered === correct) {
    hideAllLoginSteps();
    document.getElementById("loginResetError").classList.add("hidden");
    document.getElementById("loginNewPasswordInput").value = "";
    document.getElementById("loginStepReset").classList.remove("hidden");
  } else {
    document.getElementById("loginForgotError").classList.remove("hidden");
  }
}

async function submitNewPassword() {
  const input = document.getElementById("loginNewPasswordInput");
  const newPassword = input.value;

  if (!newPassword || newPassword.length < 4) {
    document.getElementById("loginResetError").classList.remove("hidden");
    return;
  }

  try {
    await db.collection("accounts").doc(selectedAccountKey).update({ password: newPassword });
    accountsCache[selectedAccountKey] = { ...accountsCache[selectedAccountKey], password: newPassword };
    loginSuccess(selectedAccountKey, false);
  } catch (e) {
    console.error("Could not save new password:", e);
    document.getElementById("loginResetError").classList.remove("hidden");
  }
}

function continueAsGuest() {
  loginSuccess(null, true);
}

function loginSuccess(key, isGuest) {
  currentUser = isGuest
    ? { key: null, name: "Guest", isGuest: true }
    : { key: key, name: ACCOUNT_NAMES[key], isGuest: false };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  } catch (e) {
    console.warn("Could not save login:", e);
  }

  hideLoginGate();
  updateLoggedInBar();
  updateComposerVisibility();
  updateAccountMenuVisibility();
  refreshNotesForCurrentUser();
}

function logout() {
  currentUser = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Could not clear login:", e);
  }
  showAccountStep();
  document.getElementById("loginGate").classList.remove("hidden");
  updateLoggedInBar();
  updateComposerVisibility();
  updateAccountMenuVisibility();
  refreshNotesForCurrentUser();
}

function hideLoginGate() {
  document.getElementById("loginGate").classList.add("hidden");
}

function updateLoggedInBar() {
  const label = document.getElementById("navUserLabel");
  if (!label) return;
  label.textContent = currentUser ? currentUser.name : "";
}

function updateComposerVisibility() {
  const composer = document.getElementById("noteComposer");
  const guestNotice = document.getElementById("guestNotice");
  const list = document.getElementById("notesList");
  const canView = currentUser && !currentUser.isGuest;

  if (canView) {
    composer.classList.remove("hidden");
    guestNotice.classList.add("hidden");
    list.classList.remove("hidden");
  } else {
    composer.classList.add("hidden");
    guestNotice.classList.remove("hidden");
    list.classList.add("hidden");
  }

  updateGalleryVisibility();
}

function updateGalleryVisibility() {
  const grid = document.getElementById("galleryGrid");
  const guestNotice = document.getElementById("galleryGuestNotice");
  if (!grid || !guestNotice) return;
  const canView = currentUser && !currentUser.isGuest;

  if (canView) {
    grid.classList.remove("hidden");
    guestNotice.classList.add("hidden");
  } else {
    grid.classList.add("hidden");
    guestNotice.classList.remove("hidden");
  }
}

// ---------- Navbar: chat popup, account menu, change password ----------
function openChatModal() {
  document.getElementById("chatModal").classList.remove("hidden");
  const list = document.getElementById("notesList");
  if (list) list.scrollTop = list.scrollHeight;
}

function closeChatModal() {
  document.getElementById("chatModal").classList.add("hidden");
}

function toggleAccountMenu() {
  const menu = document.getElementById("accountMenu");
  if (menu) menu.classList.toggle("hidden");
}

// Close the account menu when clicking outside of it
document.addEventListener("click", (e) => {
  const wrapper = document.querySelector(".navbar-account-wrapper");
  const menu = document.getElementById("accountMenu");
  if (wrapper && menu && !wrapper.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

function updateAccountMenuVisibility() {
  const changePwBtn = document.getElementById("changePasswordMenuBtn");
  if (!changePwBtn) return;
  const canChangePassword = currentUser && !currentUser.isGuest;
  changePwBtn.classList.toggle("hidden", !canChangePassword);
}

function showChangePasswordModal() {
  document.getElementById("accountMenu").classList.add("hidden");

  if (!currentUser || currentUser.isGuest) {
    alert("Log in as Aren or Ica first to change your password.");
    return;
  }

  document.getElementById("currentPasswordInput").value = "";
  document.getElementById("newPasswordInput2").value = "";
  document.getElementById("confirmPasswordInput").value = "";
  document.getElementById("changePasswordError").classList.add("hidden");
  document.getElementById("changePasswordSuccess").classList.add("hidden");
  document.getElementById("changePasswordModal").classList.remove("hidden");
}

function closeChangePasswordModal() {
  document.getElementById("changePasswordModal").classList.add("hidden");
}

async function submitChangePassword() {
  const currentPw = document.getElementById("currentPasswordInput").value;
  const newPw = document.getElementById("newPasswordInput2").value;
  const confirmPw = document.getElementById("confirmPasswordInput").value;
  const errorEl = document.getElementById("changePasswordError");
  const successEl = document.getElementById("changePasswordSuccess");

  errorEl.classList.add("hidden");
  successEl.classList.add("hidden");

  if (!currentUser || currentUser.isGuest) {
    closeChangePasswordModal();
    return;
  }

  const account = await fetchAccount(currentUser.key);

  if (!account || currentPw !== account.password) {
    errorEl.textContent = "Current password is incorrect.";
    errorEl.classList.remove("hidden");
    return;
  }
  if (!newPw || newPw.length < 4) {
    errorEl.textContent = "New password must be at least 4 characters.";
    errorEl.classList.remove("hidden");
    return;
  }
  if (newPw !== confirmPw) {
    errorEl.textContent = "New passwords don't match.";
    errorEl.classList.remove("hidden");
    return;
  }

  try {
    await db.collection("accounts").doc(currentUser.key).update({ password: newPw });
    accountsCache[currentUser.key] = { ...accountsCache[currentUser.key], password: newPw };
    successEl.classList.remove("hidden");
    setTimeout(closeChangePasswordModal, 1200);
  } catch (e) {
    console.error("Could not update password:", e);
    errorEl.textContent = "Something went wrong — please try again.";
    errorEl.classList.remove("hidden");
  }
}

// Restore a previous login on page load, if any
function restoreLogin() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentUser = JSON.parse(saved);
      hideLoginGate();
    }
  } catch (e) {
    console.warn("Could not restore login:", e);
  }
  updateLoggedInBar();
  updateComposerVisibility();
  updateAccountMenuVisibility();
}

// ---------- Notes board (text + photos) ----------

function handlePhotoSelected(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = ""; // allow re-selecting the same file later
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }
  if (file.size > MAX_PHOTO_BYTES) {
    alert("That photo is too large — please pick one under 8MB.");
    return;
  }

  selectedPhotoFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("photoPreviewImg").src = e.target.result;
    document.getElementById("photoPreviewRow").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function clearSelectedPhoto() {
  selectedPhotoFile = null;
  document.getElementById("photoPreviewImg").src = "";
  document.getElementById("photoPreviewRow").classList.add("hidden");
}

function setUploadProgress(percent) {
  const wrap = document.getElementById("photoUploadProgress");
  const bar = document.getElementById("photoUploadProgressBar");
  if (percent === null) {
    wrap.classList.add("hidden");
    bar.style.width = "0%";
  } else {
    wrap.classList.remove("hidden");
    bar.style.width = percent + "%";
  }
}

function submitNote() {
  if (!currentUser || currentUser.isGuest) return;

  const input = document.getElementById("noteInput");
  const message = input.value.trim();

  if (!message && !selectedPhotoFile) return;

  if (selectedPhotoFile) {
    uploadPhotoNote(selectedPhotoFile, message);
  } else {
    postNote({ message });
    input.value = "";
  }
}

// Downscales an image file to at most maxDimension px on its longest side
// and returns just the base64 payload (no "data:image/..." prefix).
//
// This matters most on mobile: a large photo (DSLR export, screenshot at
// high resolution, etc.) can be several MB at full resolution, and some
// mobile/in-app browsers fail partway through decoding or canvas operations
// with little detail. This tries a few strategies in order, from most to
// least efficient, so a failure in one doesn't just give up outright.
async function readAndResizeImage(file, maxDimension = 1600) {
  // Strategy 1: createImageBitmap, which decodes more efficiently than
  // loading a full-resolution <img> (some browsers can even resize during
  // decode, avoiding ever holding the full-size image in memory).
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return drawToCanvasBase64(bitmap, bitmap.width, bitmap.height, maxDimension);
    } catch (err) {
      console.warn("createImageBitmap failed, falling back:", err);
    }
  }

  // Strategy 2: classic <img> + blob URL + canvas.
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        try {
          resolve(drawToCanvasBase64(img, img.naturalWidth, img.naturalHeight, maxDimension));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("image element failed to load"));
      };
      img.src = objectUrl;
    });
  } catch (err) {
    console.warn("Canvas-based resize failed, falling back to raw upload:", err);
  }

  // Strategy 3: give up on resizing and just read the raw file. Larger
  // upload, but this avoids canvas/decode entirely, which is where the
  // failures above happen — plain FileReader is the most widely supported
  // path even if it's not the most efficient one.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("could not read the raw file either"));
    reader.readAsDataURL(file);
  });
}

function drawToCanvasBase64(source, sourceWidth, sourceHeight, maxDimension) {
  let width = sourceWidth;
  let height = sourceHeight;
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height / width) * maxDimension);
      width = maxDimension;
    } else {
      width = Math.round((width / height) * maxDimension);
      height = maxDimension;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(source, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
}

// Plain read with no resizing -- used as a fallback if the canvas approach
// fails for some reason (some mobile browsers reject very large canvases).
function readImageDirectly(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(reader.error || new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });
}

async function uploadPhotoNote(file, caption) {
  setUploadProgress(0);

  let base64Data;
  try {
    base64Data = await readAndResizeImage(file);
  } catch (resizeErr) {
    console.warn("Canvas resize failed, falling back to direct read:", resizeErr);
    try {
      base64Data = await readImageDirectly(file);
    } catch (directErr) {
      console.error("Could not read photo (both resize and direct read failed):", directErr);
      setUploadProgress(null);
      alert("Could not read that photo (" + (directErr.message || directErr.name || "unknown error") + "). Please try a different photo.");
      return;
    }
  }

  const formData = new FormData();
  formData.append("image", base64Data);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      setUploadProgress(Math.round((e.loaded / e.total) * 100));
    }
  };

  xhr.onload = () => {
    setUploadProgress(null);
    let response;
    try {
      response = JSON.parse(xhr.responseText);
    } catch (e) {
      console.error("Could not parse ImgBB response:", xhr.responseText);
      alert("Could not upload that photo — please try again.");
      return;
    }

    if (xhr.status >= 200 && xhr.status < 300 && response.success) {
      postNote({ message: caption, imageUrl: response.data.url });
      document.getElementById("noteInput").value = "";
      clearSelectedPhoto();
    } else {
      console.error("ImgBB upload failed:", response);
      alert("Could not upload that photo (" + (response.error && response.error.message || xhr.status) + "). Please try again.");
    }
  };

  xhr.onerror = () => {
    setUploadProgress(null);
    console.error("Network error uploading to ImgBB");
    alert("Could not reach the photo host — check your connection and try again.");
  };

  xhr.send(formData);
}

function postNote({ message, imageUrl }) {
  const note = {
    author: currentUser.name,
    authorKey: currentUser.key,
    message: message || "",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (imageUrl) note.imageUrl = imageUrl;

  db.collection("notes").add(note).catch((err) => {
    console.error("Could not post note:", err);
    alert("Could not send that — please try again.");
  });
}

function deleteNote(noteId) {
  if (!confirm("Delete this note?")) return;
  // Note: this only removes the Firestore message. If the note had a photo,
  // the image stays hosted on ImgBB (harmless — it's just an orphaned,
  // unlisted image) since ImgBB doesn't offer a simple client-side delete
  // without the one-time delete_url returned at upload time.
  db.collection("notes").doc(noteId).delete().catch((err) => {
    console.error("Could not delete note:", err);
    alert("Could not delete this note — please try again.");
  });
}

function formatTimestamp(ts) {
  if (!ts || !ts.toDate) return "";
  const date = ts.toDate();
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " +
    date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function renderNotes(snapshot) {
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  // Guests shouldn't have message content in the DOM at all, not just
  // visually hidden — leave the list empty; updateComposerVisibility()
  // shows the "log in to view" notice instead.
  if (!currentUser || currentUser.isGuest) return;

  if (snapshot.empty) {
    const empty = document.createElement("p");
    empty.className = "text-purple-400 text-sm text-center";
    empty.textContent = "No messages yet — say hi 💕";
    list.appendChild(empty);
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();

    // Only the message's own author can delete it (older messages without
    // an authorKey fall back to matching the display name).
    const isOwnNote = currentUser && !currentUser.isGuest && (
      data.authorKey === currentUser.key ||
      (!data.authorKey && data.author === currentUser.name)
    );

    const row = document.createElement("div");
    row.className = "chat-row " + (isOwnNote ? "chat-row-mine" : "chat-row-theirs");

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + (isOwnNote ? "chat-bubble-mine" : "chat-bubble-theirs");

    const author = document.createElement("div");
    author.className = "note-card-author";
    author.textContent = data.author || "Someone";
    bubble.appendChild(author);

    if (data.imageUrl) {
      const img = document.createElement("img");
      img.className = "note-card-photo";
      img.src = data.imageUrl;
      img.alt = "Photo shared in chat";
      img.loading = "lazy";
      img.onclick = () => openLightbox(data.imageUrl, data.message || "");
      bubble.appendChild(img);
    }

    if (data.message) {
      const message = document.createElement("div");
      message.className = "note-card-message";
      message.textContent = data.message;
      bubble.appendChild(message);
    }

    const time = document.createElement("div");
    time.className = "note-card-time";
    time.textContent = formatTimestamp(data.createdAt);
    bubble.appendChild(time);

    if (isOwnNote) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "note-card-delete";
      deleteBtn.innerHTML = "&times;";
      deleteBtn.title = "Delete this message";
      deleteBtn.onclick = () => deleteNote(doc.id);
      bubble.appendChild(deleteBtn);
    }

    row.appendChild(bubble);
    list.appendChild(row);
  });

  // Auto-scroll to the newest message
  list.scrollTop = list.scrollHeight;
}

// ---------- Shared photo gallery (built from the same "notes" collection) ----------
function renderGallery(snapshot) {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!currentUser || currentUser.isGuest) return;

  const photoDocs = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.imageUrl) photoDocs.push({ id: doc.id, ...data });
  });

  if (photoDocs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-purple-400 text-sm text-center col-span-full";
    empty.textContent = "No photos shared yet — send one from the chat 💕";
    grid.appendChild(empty);
    return;
  }

  // Newest first
  photoDocs.reverse().forEach((data) => {
    const tile = document.createElement("div");
    tile.className = "photo-placeholder gallery-photo";
    tile.title = data.message || data.author || "";

    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = data.message || `Photo shared by ${data.author || "someone"}`;
    img.loading = "lazy";
    img.onclick = () => openLightbox(data.imageUrl, data.message || "");

    tile.appendChild(img);
    grid.appendChild(tile);
  });
}

function openLightbox(imageUrl, caption) {
  document.getElementById("lightboxImg").src = imageUrl;
  document.getElementById("lightboxCaption").textContent = caption || "";
  document.getElementById("photoLightbox").classList.remove("hidden");
}

function closeLightbox(event) {
  // Only close on backdrop or close-button clicks, not clicks inside the image itself
  if (event && event.target.id === "lightboxImg") return;
  document.getElementById("photoLightbox").classList.add("hidden");
}

let lastNotesSnapshot = null;

function listenForNotes() {
  db.collection("notes")
    .orderBy("createdAt", "asc")
    .limitToLast(100)
    .onSnapshot((snapshot) => {
      lastNotesSnapshot = snapshot;
      renderNotes(snapshot);
      renderGallery(snapshot);
    }, (err) => {
      console.error("Chat listener error:", err);
      const list = document.getElementById("notesList");
      list.innerHTML = '<p class="text-purple-400 text-sm text-center">Could not load messages right now.</p>';
    });
}

// Re-render the existing message list against the *current* logged-in user
// (needed because switching accounts doesn't itself trigger a new Firestore
// event — without this, delete buttons could "leak" between accounts).
function refreshNotesForCurrentUser() {
  if (lastNotesSnapshot) {
    renderNotes(lastNotesSnapshot);
    renderGallery(lastNotesSnapshot);
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  restoreLogin();
  listenForNotes();

  const noteInput = document.getElementById("noteInput");
  if (noteInput) {
    noteInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitNote();
      }
    });
  }
});