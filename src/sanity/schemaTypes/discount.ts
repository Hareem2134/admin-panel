export default {
    name: 'discount',
    title: 'Discounts',
    type: 'document',
    fields: [
      {
        name: 'code',
        title: 'Discount Code',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'type',
        title: 'Discount Type',
        type: 'string',
        options: {
          list: [
            { title: 'Percentage', value: 'percentage' },
            { title: 'Fixed Amount', value: 'fixed' },
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'value',
        title: 'Discount Value',
        type: 'number',
        validation: (Rule: any) => Rule.required().min(0),
      },
      {
        name: 'active',
        title: 'Active',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'expiry',
        title: 'Expiry Date',
        type: 'datetime',
        validation: (Rule: any) => Rule.required(),
      },
    ],
  };