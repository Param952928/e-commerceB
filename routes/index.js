const product = require('./productRoutes')
const auth = require('./authRoutes')
const categorie = require('./categoryRoutes')

module.exports = (app)=> {
    app.use('/api/v1/product', product)
    app.use('/api/v1/auth', auth),
    app.use('/api/v1/category', categorie)
}
