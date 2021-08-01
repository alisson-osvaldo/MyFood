const express = require('express');
const app = express( );
const PORT = 3000;

app.use(express.static('www'));

//Recursos de upload.
const multer = require('multer');
const storage = multer.diskStorage({ //diskStorege ele q vai se encarregar de gravar as informações no disco
    destination: function(req, arquivo, callback){ //uma função que vai receber o request, arquivo  e vai ter uma função de callback
        callback(null, 'www/img/');
    },
    filename: function(req, arquivo,callback) {
        callback(null, arquivo.originalname);
    }
})

const upload = multer({storage: storage});//opload vai pergar o multer e vai configurar no multer o storage para o storage que criei
    app.post("/upload", upload.single('arquivo'),  (req, res) => { res.status(200).send(); //mandar a img para /upload
})

const msg = `Servidor rodando na porta: ${PORT}`;
app.listen(PORT,  ( ) => console.log(msg));