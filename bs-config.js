module.exports = {
  injectChanges: false,
  files: ['./**/*.{html,htm,css,js}'],
  watchOptions: { ignored: 'node_modules' },
  server: {
    baseDir: './',
  },
  port: 3000,
  host: '192.168.0.195',
  open: false,
};
