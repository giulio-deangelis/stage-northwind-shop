sap.ui.define([
  'sap/ui/core/mvc/Controller',
  '../service/Cart',
  '../model/Formatter'
], (
  Controller,
  Cart,
  Formatter
) => {

  var model, odataModel

  return Controller.extend('training.northwindshop.app.controller.Products', {

    formatter: Formatter,

    onInit() {
      sap.ui.core.UIComponent.getRouterFor(this)
        .getRoute('Products')
        .attachPatternMatched(this.onEnter, this)
    },

    onEnter() {
      model = this.getView().getModel()
      odataModel = this.getView().getModel('Northwind')
      this._fetchData()
    },

    onShowCart() {
      this.getOwnerComponent().getRouter().navTo('Cart')
    },

    onAddToCart(ev) {
      // get the listItem from the button's parent and retrieve its context
      const ctx = ev.getSource().getParent()?.getBindingContext()
      const product = ctx.getObject()

      if (product.UnitsInStock <= 0)
        return

      // Add the product to the Cart and decrement the stock
      Cart.add(product)
      model.setProperty(ctx.getPath() + '/UnitsInStock', product.UnitsInStock - 1)
    },

    onShowProduct(ev) {
      const ctx = ev.getSource().getBindingContext()
      const id = ctx.getProperty('ProductID')
      this.getOwnerComponent().getRouter().navTo('Product', {id})
    },

    _fetchData() {
      odataModel.read('/Products', {

        success(_res, body, data = body.data.results) {
          // decrement the stock of units inside the cart
          for (const product of data)
            product.UnitsInStock -= Cart.getQuantity(product.ProductID)
          model.setData({Products: data})
          model.refresh()
        },

        error(err) {
          console.error(err)
        }
      })
    },
  })
})
