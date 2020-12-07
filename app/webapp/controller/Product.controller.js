sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  '../service/Cart',
  '../model/Formatter'
], (
  Controller,
  JSONModel,
  Cart,
  Formatter
) => {

  var model, odataModel

  return Controller.extend('training.northwindshop.app.controller.Products', {

    formatter: Formatter,

    onInit() {
      this.getOwnerComponent()
        .getRouter()
        .getRoute('Product')
        .attachPatternMatched(this.onEnter, this)
    },

    onBack() {
      this.getOwnerComponent().getRouter().navTo('Products')
    },

    onShowCart() {
      this.getOwnerComponent().getRouter().navTo('Cart')
    },

    onEnter(ev) {
      odataModel = this.getOwnerComponent().getModel('Northwind')
      model = new JSONModel()

      const productId = ev.getParameter('arguments').id

      this.getView().setModel(model)
      this._fetchProduct(productId)
    },

    onQuantityChange(ev) {
      let value = ev.getParameter('value')
      const input = ev.getSource()
      const stock = model.getProperty('/Product/UnitsInStock')

      if (value < 1)
        value = 1
      else if (value > stock)
        value = stock
      else if (value > 99)
        value = 99
      else
        value = parseInt(value, 10)


      input.setValue(value)
      model.setProperty('/CartQuantity', value)
    },

    onAddToCart() {
      const quantity = model.getProperty('/CartQuantity')
      const product = model.getProperty('/Product')

      if (product.UnitsInStock <= 0 || product.UnitsInStock - quantity < 0)
        return

      Cart.add(product, quantity)
      model.setProperty('/Product/UnitsInStock', product.UnitsInStock - quantity)
    },

    _fetchProduct(id) {
      const that = this

      odataModel.read(`/Products(${id})`, {

        success(_res, body, data = body.data) {
          data.UnitsInStock -= Cart.getQuantity(data.ProductID)
          model.setData({Product: data})
          model.setProperty('/CartQuantity', 1)
          that._fetchSupplier(data.SupplierID)
        },

        error(err) {
          console.error(err)
        }
      })
    },

    _fetchSupplier(id) {
      odataModel.read(`/Suppliers(${id})`, {

        success(_res, body, data = body.data) {
          model.setProperty('/Supplier', data)
        },

        error(err) {
          console.error(err)
        }
      })
    }
  })
})