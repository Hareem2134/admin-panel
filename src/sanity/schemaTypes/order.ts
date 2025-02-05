export default {
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    {
      name: "items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "food", type: "reference", to: [{ type: "food" }] },
            { name: "quantity", type: "number", title: "Quantity" },
            { name: "priceAtPurchase", type: "number", title: "Price at Purchase" },
          ],
        },
      ],
    },
    { name: "total", type: "number", title: "Total" },
    { name: "subtotal", type: "number", title: "Subtotal" },
    { name: "discount", type: "number", title: "Discount" },
    { name: "shippingCost", type: "number", title: "Shipping Cost" },
    { name: "status", type: "string", title: "Status" },
    { name: "date", type: "datetime", title: "Order Date" },
    {
      name: "shippingAddress",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "zip", type: "string", title: "ZIP Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    },
    { name: "paymentMethod", type: "string", title: "Payment Method" },
    { name: "transactionId", type: "string", title: "Transaction ID" },
  ],
};
