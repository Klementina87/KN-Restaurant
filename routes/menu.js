const express = require('express')
const router = express.Router()
const { menuController } = require('../controllers/menu-controller')

router.get('/add', async(req, res, next) => {
    await menuController.add(req, res, next)
})

router.post('/save', async (req,res,next)=>{
    await menuController.save(req, res, next)
})

router.get('/view_item',async(req,res,next)=>{
    await menuController.view(req, res, next)
})

router.get('/edit',async(req,res,next)=>{
    await menuController.edit(req, res, next)
})

router.get('/view_all',async(req,res,next)=>{
    await menuController.viewAll(req, res, next)
})
router.get('/delete_item',async(req,res,next)=>{
    await menuController.delete(req, res, next)
})

router.get('/destroy',async(req,res,next)=>{
    await menuController.destroy(req, res, next)
})

module.exports = router;