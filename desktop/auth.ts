// Desktop identity is the current Windows user's private local save.
// This module replaces hosted authentication only in the desktop build.
export async function getChatGPTUser() {
  return {userId: "desktop-local", displayName: "Local player", email: "", fullName: null};
}
