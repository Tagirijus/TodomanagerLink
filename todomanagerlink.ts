import { editor, system } from "@silverbulletmd/silverbullet/syscalls";


const defaultConfig = {
  security: "",
  nc_calendars: {
    default: {
      nc_uri: "",
      nc_user: "",
      nc_password: "",
      nc_tags: []
    }
  }
};

async function getConfig() {
  return {...defaultConfig, ...await system.getSpaceConfig("todomanagerLink", defaultConfig)};
}

export async function showAndGetTasks() {
  const config = await getConfig();

  await editor.flashNotification(
    "Getting tasks from online calendar ...",
    "info"
  );
}

export async function modifyTasks() {
  await editor.flashNotification(
    "TODO: modifyTasks() ...",
    "error"
  );
}
