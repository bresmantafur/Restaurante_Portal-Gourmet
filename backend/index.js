const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Autenticación básica simple (mejorar en producción)
const ADMIN_USER = 'admin';
const ADMIN_PASS = '1234';

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.json({ success: true });
    }
    res.status(401).json({ success: false });
});

// Ruta para subir imágenes
app.post('/upload', upload.single('imagen'), (req, res) => {
    if (!req.file) return res.status(400).send('No se subió ninguna imagen');
    res.json({ url: `/uploads/${req.file.filename}` });
});

// Ruta para editar el menú (simulación, sin base de datos)
let menu = [];

app.get('/menu', (req, res) => res.json(menu));

app.post('/menu', (req, res) => {
    menu.push(req.body);
    res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor Backend corriendo en http://localhost:${PORT}`));
