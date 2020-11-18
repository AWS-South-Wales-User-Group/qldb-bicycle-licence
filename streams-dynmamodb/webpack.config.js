module.exports = {
    entry: {
      'functions/qldb-streams-dynamodb': './functions/qldb-streams-dynamodb.js',
      'functions/dynamodb-search': './functions/dynamodb-search.js',
    },
    mode: 'production',
    target: 'node',
  };