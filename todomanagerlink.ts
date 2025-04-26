/*
TODO:
- being able to use different calendars!
*/


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

async function generateCalendarPOST(calendar: string, weeklist: string) {
  const config = await getConfig();
  if (calendar === undefined) { calendar = 'default'; }
  if (!(calendar in config.nc_calendars)) { return false; }
  if (weeklist === undefined) { weeklist = ''; }

  return {
    url: config.todomanager_url,
    post_data: {
      security: config.security,
      'weeklist': weeklist,
      this_week: true,
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
  let post = await generateCalendarPOST(calendar, '');
  let response = await fetch(
    post.url + '/weeklist/get', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(post.post_data)
  });
  if (!response.ok) { throw new Error(`HTTP-Error: ${response.status}`) }

  return await response.json();
}

async function modifyWeeklistPOST(calendar: string, weeklist: string) {
  let post = await generateCalendarPOST(calendar, weeklist);
  let response = await fetch(
    post.url + '/weeklist/modify', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(post.post_data)
  });
  if (!response.ok) { throw new Error(`HTTP-Error: ${response.status}`) }

  return await response.json();
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
    let weeklist_post = await getWeeklistPOST('default');
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
    'Using tasks from this page to modify online tasks ...',
    'info'
  );

  let weeklist = await editor.getText();
  let weeklist_post = await modifyWeeklistPOST('default', weeklist);
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
    await editor.setText('⚠️ could not modify weeklist! --> "' + message + '"');
    console.log('TodomanagerLink: Could not modify weeklist with content. Post response is:');
    console.log(weeklist_post);
  }
}
