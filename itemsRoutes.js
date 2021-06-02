const express = require('express');
const items = require('./fakeDb');
const ExpressError = require('./expressError');

const router = new express.Router();

router.get('/', (req, res) => {
    return res.json(items);
});

router.post('/', (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    
    const newItem = {name, price};
    items.push(newItem);

    return res.json({'added': newItem});
})

router.get('/:name', (req, res, next) => {
    try {
        const item = items.find(({name, price}) => name === req.params.name);
        if (!item) throw new ExpressError('Not Found', 404);
        return res.json({item});
    } catch (err) {
        return next(err);
    }
})

router.patch('/:name', (req, res, next) => {
    try {
        const item = items.find(({name, price}) => name === req.params.name);
        if (!item) throw new ExpressError('Not Found', 404);
        item.name = req.body.name ? req.body.name : item.name;
        item.price = req.body.price ? req.body.price : item.price;
    
        return res.json({'updated': item});    
    } catch (err) {
        return next(err);
    }
})

router.delete('/:name', (req, res, next) => {
    try {
        itemIndex = items.findIndex(({name, price}) => name === req.params.name);
        if (itemIndex === -1) throw new ExpressError('Not Found', 404);
        items.splice(itemIndex, 1);
    
        return res.json({'message': 'Deleted'});
    } catch (err) {
        return next(err);
    }
})

module.exports = router;