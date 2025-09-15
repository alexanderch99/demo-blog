import RoleModel from "../models/role-model";

export default async function ensureDefaultRoles() {
  await RoleModel.updateOne(
    { name: "default" },
    {
      $setOnInsert: {
        displayName: "Пользователь",
        isAdmin: false,
        priority: 11,
        permissions: [],
        secured: true,
      },
    },
    { upsert: true },
  );

  await RoleModel.updateOne(
    { name: "admin" },
    {
      $setOnInsert: {
        displayName: "Администратор",
        isAdmin: true,
        priority: 99,
        permissions: ["all"],
        secured: true,
      },
    },
    { upsert: true },
  );
}
