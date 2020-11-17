module.exports = {
    entry: {
      'functions/create-licence': './functions/create-licence.js',
      'functions/delete-licence': './functions/delete-licence.js',
      'functions/get-licence': './functions/get-licence.js',
      'functions/get-licence-history': './functions/get-licence-history.js',
      'functions/update-licence': './functions/update-licence.js',
      'functions/update-contact': './functions/update-contact.js',
      'functions/createQldbIndex': './functions/createQldbIndex.js',
      'functions/createQldbTable': './functions/createQldbTable.js',
    },
    mode: 'production',
    target: 'node',
  };