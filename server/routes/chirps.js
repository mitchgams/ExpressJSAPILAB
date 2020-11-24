const express = require('express');
const chirpsStore = require('../filestore');
let router = express.Router();



router.get('/:id?', (req, res) => {
    let id = req.params.id;
    if(id) {
        res.json(chirpsStore.GetChirp(id))
    } else {
        res.json(chirpsStore.GetChirps());
    }
});

router.post('/', (req, res) => {
    chirpsStore.CreateChrip(req.body);
    res.sendStatus(200);
});

router.delete('/delete/:id?', (req, res) => {
    let id = req.params.id;
    if(id !== undefined) {
       chirpsStore.DeleteChirp(id);
       console.log(`Deleting Chirp id: ${id}`);
       res.sendStatus(200);
    }
});

router.put('/edit/:id?', (req, res) => {
    let id = req.params.id;
    if(id !== undefined) {
        chirpsStore.UpdateChirp(id, req.body);
    }
})



module.exports = router;