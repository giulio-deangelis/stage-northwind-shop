sap.ui.define(['../util/MessageHelper'], (msg) => {

  return {

    formatStock(stock) {
      return stock > 0
        ? `${msg.i18n('Available')} (${stock} ${msg.i18n('Units')})`
        : msg.i18n('Unavailable')
    },

    formatPrice(price) {
      return parseInt(price, 10) + ' €'
    },

    formatQuantityPerUnit(text) {
      // perform translation here
      return text
    }
  }
})