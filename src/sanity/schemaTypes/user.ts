import { defineType } from "sanity"; // Import defineType
import type { Rule } from "sanity"; // Import Rule type

export default defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: Rule) => Rule.required(), // Explicitly typed
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: Rule) => Rule.required().email(), // Explicitly typed
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Editor", value: "editor" },
          { title: "Viewer", value: "viewer" },
        ],
      },
      validation: (Rule: Rule) => Rule.required(), // Explicitly typed
    },
  ],
});
