export default {
  name: {
    description: 'Google Cloud project name',
    default: 'Carousel Daily Schedule'
  },
  billing: {
    description: 'Google Cloud billing account ID for this project'
  },
  region: {
    description: 'Google Cloud region in which to create App Engine instance'
  },
  supportEmail: {
    description: 'Support email address for app OAuth consent screen'
  },
  logFilePath: {
    description: 'Path to log file',
    default: 'logs/setup.log'
  }
};
