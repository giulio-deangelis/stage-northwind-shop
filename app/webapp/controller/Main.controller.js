sap.ui.define([
  'sap/ui/core/mvc/Controller',
  '../util/MessageHelper'
], (
  Controller,
  MessageHelper
) => {

  return Controller.extend('training.northwindshop.app.controller.Main', {

    onInit() {
      MessageHelper.setI18nModel(this.getView().getModel('i18n'))
    }
  })
})