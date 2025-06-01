const firebaseConfig = {
    apiKey: "AIzaSyCvFA_7JsGYMljQGv2_BrqxJVbw3N8Hiaw",
    authDomain: "continue-13d12.firebaseapp.com",
    projectId: "continue-13d12",
    storageBucket: "continue-13d12.firebasestorage.app",
    messagingSenderId: "814687182273",
    appId: "1:814687182273:web:74439099bc7c8e0e70a340",
    measurementId: "G-28GSE0P3JJ"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let erasing = false;

const toggleModeBtn = document.getElementById('toggleModeBtn');
const clearCanvasBtn = document.getElementById('clearCanvasBtn');

let author = localStorage.getItem('authorName');
if (!author) {
    author = prompt("Enter your name:");
    localStorage.setItem('authorName', author);
}

function isAuthor() {
    return author === "Anime0022";
}

function loadImage() {
    const storageRef = storage.ref('signature.png');
    storageRef.getDownloadURL()
    .then((url) => {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = url;
    })
    .catch((error) => {
        console.log("Image not found:", error);
    });
}

function saveImage() {
    canvas.toBlob((blob) => {
    const storageRef = storage.ref('signature.png');
    storageRef.put(blob)
    .then(() => {
        console.log("Image saved.");
    })
    .catch((error) => {
        console.error("Saving error:", error);
        });
    });
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    if (erasing) {
    ctx.clearRect(e.offsetX - 5, e.offsetY - 5, 10, 10);
    } else {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    saveImage();
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});

toggleModeBtn.addEventListener('click', () => {
    if (!isAuthor() && !erasing) {
        alert("Only the author can use the eraser.");
        return;
    }
    erasing = !erasing;
    toggleModeBtn.textContent = erasing ? "Mode: Eraser 🧽" : "Mode: Drawing ✏️";
});

clearCanvasBtn.addEventListener('click', () => {
    if (!isAuthor()) {
        alert("Only the author can clear signatures.");
        return;
    }
    if (confirm("Are you sure you want to clear the signatures?")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const storageRef = storage.ref('signature.png');
        storageRef.delete()
        .then(() => {
            console.log("Image deleted.");
        })
        .catch((error) => {
            console.error("Delete error:", error);
        });
    }
});

window.onload = loadImage;