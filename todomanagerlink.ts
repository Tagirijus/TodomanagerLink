import { editor, system } from '@silverbulletmd/silverbullet/syscalls';


const defaultConfig = {
  todomanager_url: '',
  security: '',
  nc_calendars: {
    default: {
      nc_url: '',
      nc_calendar: '',
      nc_user: '',
      nc_password: '',
      nc_tags: []
    }
  }
};

const TODOMANAGER_PAGE = '✅ TodoManager';


// HELPER FUNCTIONS

async function getConfig() {
  return {...defaultConfig, ...await system.getSpaceConfig('todomanagerLink', defaultConfig)};
}

async function generateCalendarPOST(calendar: string, this_week: boolean) {
  const config = await getConfig();
  if (calendar === undefined) { calendar = 'default' }
  if (!(calendar in config.nc_calendars)) { return false }
  if (this_week === undefined) { this_week = true }

  return {
    url: config.todomanager_url,
    post_data: {
      security: config.security,
      weeklist: '',
      'this_week': this_week,
      nc_uri: config.nc_calendars[calendar].nc_url,
      nc_calendar: config.nc_calendars[calendar].nc_calendar,
      nc_user: config.nc_calendars[calendar].nc_user,
      nc_password: config.nc_calendars[calendar].nc_password,
      nc_tags: config.nc_calendars[calendar].nc_tags
    }
  }
}

async function createTempPage() {
  await editor.navigate({ page: TODOMANAGER_PAGE });
}

async function getWeeklistPOST(calendar: string) {
  const config = await getConfig();

  let post = await generateCalendarPOST();
  console.log(post);
  let response = await fetch(
    post.url + '/weeklist/get', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(post.post_data)
  });
  if (!response.ok) { throw new Error(`HTTP-Error: ${response.status}`) }

  return await response.json();
}

async function modifyWeeklist(calendar: string, weeklist: string) {
  const config = await getConfig();

  let post = await generateCalendarPOST();
  console.log(post);
  let response = await fetch(
    post.url + '/weeklist/modify', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(post.post_data)
  });
  if (!response.ok) { throw new Error(`HTTP-Fehler: ${response.status}`) }
}


// MAIN FUNCTIONS HERE

export async function showAndGetTasks() {
  await editor.flashNotification(
    'Getting tasks from online calendar ...',
    'info'
  );

  await createTempPage();

  const page = await editor.getCurrentPage();

  if (page === TODOMANAGER_PAGE) {
    await editor.setText('loading ...');
    let weeklist_post = await getWeeklistPOST();
    let success = weeklist_post.success;
    let message = weeklist_post.message;
    let data = weeklist_post.data;
    if (success) {
      await editor.flashNotification(
        message,
        'info'
      );
      await editor.setText(data);
    } else {
      await editor.flashNotification(
        message,
        'error'
      );
      await editor.setText('⚠️ could not get weeklist! --> "' + message + '"');
      console.log('TodomanagerLink: Could not get weeklist from online. Post response is:');
      console.log(weeklist_post);
    }
  }

}

export async function modifyTasks() {
  await editor.flashNotification(
    'TODO: modifyTasks() ...',
    'error'
  );
}
