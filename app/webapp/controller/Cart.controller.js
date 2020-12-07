sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
  '../model/Formatter',
  '../service/Cart',
  '../ext/JSONModel',
], (
  Controller,
  JSONModel,
  Formatter,
  Cart
) => {

  var model

  return Controller.extend('training.northwindshop.app.controller.Cart', {

    formatter: Formatter,

    onInit() {
      this.getOwnerComponent()
        .getRouter()
        .getRoute('Cart')
        .attachPatternMatched(this.onEnter, this)
    },

    onEnter() {
      model = new JSONModel({Cart: Cart.get()})
      this.getView().setModel(model)
    },

    onBack() {
      if (sap.ui.core.routing.History.getInstance().getPreviousHash())
        window.history.go(-1);
      else
        this.getOwnerComponent().getRouter().navTo('Products')
    },

    onRemoveFromCart(ev) {
      const list = this.byId('cartList')
      const ctx = ev.getSource().getBindingContext()
      const id = ctx.getProperty('ProductID')

      const listItem = list
        .getItems()
        .find(it => it.getBindingContext().getProperty('ProductID') === id)

      const product = ctx.getObject()

      Cart.remove(product)
      model.removeProperty(listItem.getBindingContextPath())

      if (Cart.isEmpty())
        this.onBack()
    },

    onShowProduct(ev) {
      const ctx = ev.getSource().getBindingContext()
      const id = ctx.getProperty('ProductID')
      this.getOwnerComponent().getRouter().navTo('Product', {id})
    }
  })
})