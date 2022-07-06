const core = require('@actions/core');
const execa = require('execa');
const glob = require('@actions/glob');
const fs = require('fs/promises');
const _fs = require('fs');

async function run() {
  try {
    core.info('Checking for new custom dashboards');
    const { stdout } = await execa('git', [
      `diff`,
      '--name-only',
      'feat/dashboard-json',
      '--',
      './custom-dashboards/*.json'
    ]);
    const json_files = stdout.split('\n');
    const has_json = json_files.length > 0;
    if (!has_json) {
      core.notice('No dashboard JSON updates present. Exiting...');
      return;
    }
    core.info(`Found dashboard JSON files: ${json_files}`);
    // generate list.json
    const globber = await glob.create(`${__dirname}/*.json`);
    let files = await globber.glob();
    core.info(`Generating list.json`);
    await generateListJson(files);
    files = await globber.glob();
    core.info(`Copying files to dist`);
    await copyFilesToDist(files);
    core.info('DONE...');
  } catch (error) {
    core.setFailed(error.message);
  }
}
const generateListJson = async files => {
  let list_json = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.includes('custom-dashboards-list')) continue;
    const file_data = await fs.readFile(file);
    let json_file_data;
    try {
      json_file_data = JSON.parse(file_data);
    } catch (error) {
      core.error(error);
      core.error(`JSON parsing failed for ${file}`);
      core.setFailed(error.message);
      return;
    }
    const list_data = {
      display: (json_file_data && json_file_data.name) || 'Dashboard',
      link: (json_file_data && json_file_data.location) || '/'
    };
    list_json.push(list_data);
  }
  await fs.writeFile(
    __dirname + '/custom-dashboards-list.json',
    JSON.stringify(
      {
        meta: {},
        data: list_json
      },
      undefined,
      2
    )
  );
};
const copyFilesToDist = async files => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const file_name = file.split('/').pop();
    const target_path = 'dist/hypertrace-ui/assets/json';
    if (!_fs.existsSync(target_path)) {
      _fs.mkdirSync(target_path);
    }
    await fs.cp(file, `${target_path}/${file_name}`);
  }
};

run();
