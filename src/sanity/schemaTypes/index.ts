import { type SchemaTypeDefinition } from 'sanity'
import food from './food'
import discount from './discount'
import order from './order'
import category from './category'
import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [food, discount, order, category, user],
}
