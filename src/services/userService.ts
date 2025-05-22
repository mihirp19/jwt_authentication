import User, { UserCreation } from "../models/User";

export async function getUserService() {
  const users = await User.findAll();
  return users;
}

export async function getUserByIdService(id: number) {
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    return null;
  }
  return user;
}

export async function addUserService(data: UserCreation) {
  const user = await User.create(data);
  return user;
}

export async function updateUserService(
  id: number,
  data: Partial<UserCreation>
) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  user.update(data);
  return user;
}

export async function deleteUserService(id: number) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.destroy();
  return true;
}
