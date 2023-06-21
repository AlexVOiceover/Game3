module.exports = {
  injectChanges: false,
  files: ['./**/*.{html,htm,css,js}'],
  watchOptions: { ignored: 'node_modules' },
  server: {
    baseDir: './',
  },
  port: 3000,
  host: '10.10.10.162',
  open: false,
};
