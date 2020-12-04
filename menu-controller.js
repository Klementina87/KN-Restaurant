let Menu = require('../models/menu').Menu
let { User }= require('../models/user')
const moment = require('moment')

exports.menuController = {
    add: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                res.render('menu/add_item', {
                    isCreate: true,
                    title: 'Add to Cart',
                    styles: ['/stylesheets/second.css', '/stylesheets/style.css']
            })
            } catch (error) {
                next(error)
            }
        } else {
            req.flash('error', 'Please log in to access Orders ')
            res.redirect('/users/login')
        }
    },

    save: async (req, res, next) => {
        try {
            let menu
            if (req.body.isCreate === 'create') {
                menu = await create(req.body.item, req.body.description, req.body.price)
                req.user.menu.push(menu.id.trim())
                req.user = await User.findByIdAndUpdate({_id: req.user.id.trim() }, { menu: req.user.menu}, { new:true })
            } else
                menu = await update(req.body.menuId, req.body.item, req.body.description, req.body.price)
            req.flash('error', 'Please try again. ')
            res.redirect(`/menu/view_item?id=${menu.id}`)
        } catch (error) {
            next(error)
        }
    },

    edit: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                const menu = await Menu.findOne({_id: req.query.id.trim()})
                res.render('menu/edit_item', {
                    isCreate: false,
                    title: "Edit Your Order",
                    menuId: req.query.id.trim(),
                    menuTitle: menu.title,
                    menuBody: menu.body,
                    menuPrice: menu.price,
                    styles: ['/stylesheets/second.css', '/stylesheets/style.css']
                })
            } catch (error) {
                next(error)
            }
            } else {
                req.flash('error', 'Please log in to access Orders ')
                res.redirect('/users/login')
            }
        },


    view: async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const menu = await Menu.findOne({_id: req.query.id.trim()})
            res.render('menu/view_item', {
                title: "View Your Order",
                menuId: req.query.id,
                menuTitle: menu.title,
                menuBody: menu.body,
                menuPrice: menu.price,
                styles: ['/stylesheets/second.css', '/stylesheets/style.css']
            })
        } catch (err) {
            next(err)
        }
    } else {
        req.flash('error', 'Please log in to access Orders ')
        res.redirect('/users/login')
    }
},

    viewAll: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                let menuIds = req.user.menu
                let menuPromises = menuIds.map(id=> Menu.findOne({_id: id}))
                let menu = await Promise.all(menuPromises)
                let menuList = menu.map(menu => {
                    return {
                        id: menu.id,
                        title: menu.title,
                        body: menu.body,
                        price: menu.price
                    }
                })
                res.render('menu/view_all', {
                    mList: menuList,
                    title: "Orders",
                    isViewAllActive: "active",
                    styles: ['/stylesheets/second.css', '/stylesheets/style.css']
                })
            } catch(err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access Orders ')
            res.redirect('/users/login')
        }
    },

   edit_profile: async (req, res, next) => {
        await User.findOne({_id:req.user.id.trim()}, (err,user) => {
            if (err)
                return next (err)
            if (!user) {
                req.flash('error', 'Failed to login')
                return res.redirect('back')
            } else {
                user.edit_profile(req.body.old, req.body.new, function (err) {
                    if (err)
                        return next(err)
                    else {
                        req.flash('success', 'Your password has been updated')
                        return res.redirect('/users/my_profile')
                    }
                })
            }
        })
   },

    delete: async(req, res, next)=>{
        try{
            let menu = await Menu.findOne({_id: req.query.id.trim()})
            res.render('menu/delete_item',{
                menuId:req.query.id,
                title: menu.title,
                styles: ['/stylesheets/second.css', '/stylesheets/style.css']

            })
        }catch(err){
            next(err)
        }
    },

   destroy: async (req, res, next) => {
        try {
            const menuIndex= req.user.menu.indexOf(req.query.id.trim())
            req.user.menu.splice(menuIndex, 1)
            req.user=await User.findByIdAndUpdate({_id:req.user.id}, {menu:req.user.menu}, {new:true})
            Menu.findByIdAndDelete(req.body.menuId)
            req.flash('success', 'Item deleted successfully.')
            res.redirect('/menu/view_all')
        } catch (err) {
            next(err)
        }
    }
},

    create = async (title, body, price) => {
        let menu = new Menu ({
            title: title,
            body: body,
            price: price
        })
        menu = await menu.save()
        return menu;
    }

    update = async (id, title, body) => {
        id = id.trim()
        let menu = await Menu.findByIdAndUpdate({_id: id}, {title: title, body: body}, {new: true})
        return menu;
    }










