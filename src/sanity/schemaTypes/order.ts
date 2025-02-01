export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }]
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'product',
            title: 'Product',
            type: 'reference',
            to: [{ type: 'food' }]
          },
          {
            name: 'quantity',
            title: 'Quantity',
            type: 'number'
          },
          {
            name: 'price',
            title: 'Price at Purchase',
            type: 'number'
          }
        ]
      }]
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'pending'
    },
    {
      name: 'total',
      title: 'Total Amount',
      type: 'number'
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'zip', type: 'string' },
        { name: 'country', type: 'string' }
      ]
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string'
    },
    {
      name: 'estimatedDelivery',
      title: 'Estimated Delivery',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'user.name',
      subtitle: 'status',
      total: 'total'
    },
    prepare(selection: { title: any; subtitle: any; total: any }) {
      const { title, subtitle, total } = selection
      return {
        title: `Order by ${title}`,
        subtitle: `${subtitle} - $${total}`,
      }
    }
  }
}