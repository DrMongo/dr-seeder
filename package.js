/* Information about this package */
Package.describe({
  // Short two-sentence summary.
  summary: "Seed data with ease",
  // Version number.
  version: "0.1.1",
  // Optional.  Default is package directory name.
  name: "achtan:dr-seeder",
  // Optional github URL to your source repository.
  git: "https://github.com/DrMongo/dr-seeder.git"
});

/* This defines your actual package */
Package.onUse(function (api) {
  api.versionsFrom('0.9.0');

  api.export('Seeder');
  // Specify the source code for the package.
  api.addFiles('dist/index.js', 'server');
});
