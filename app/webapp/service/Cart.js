sap.ui.define([], () => {

  const products = {}

  return {

    add(product, quantity = 1) {
      const newQuantity = (products[product.ProductID]?.Quantity ?? 0) + quantity
      products[product.ProductID] = {...product, Quantity: newQuantity}
      const newProduct = products[product.ProductID]
      newProduct.TotalPrice = product.UnitPrice * newQuantity
    },

    get(productId) {
      if (productId)
        return products[productId]?.product
      else
        return Object.values(products)
    },

    getQuantity(productId) {
      return products[productId]?.Quantity ?? 0
    },

    getTotalPrice() {
      return Object.values(products).reduce((sum, product) =>
        sum + product.UnitPrice * product.Quantity
      )
    },

    /** Also returns the quantity after removal */
    remove(product, quantity) {
      if (quantity) {
        const p = products[product.ProductID]
        if (!p) return
        p.Quantity -= quantity
        if (p.Quantity <= 0) {
          delete products[product.ProductID]
          return 0
        }
        else {
          return p.Quantity
        }
      }
      else {
        delete products[product.ProductID]
        return 0
      }
    },

    isEmpty() {
      return Object.values(products).length === 0
    }
  }
})