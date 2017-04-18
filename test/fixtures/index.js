(() => {
  aru('string', 'get string');
  console.log(aru('string'));
  console.log(aru.has('string'));

  aru('function', () => 'get function');
  console.log(aru('function'));
  console.log(aru.has('function'));

  aru('promise', new Promise(resolve => resolve('get promise'))).then(() => {
    console.log(aru('promise'));
    console.log(aru.has('promise'));
  });

  aru('err-promise', new Promise((resolve, reject) => reject('get err-promise')))
    .then(() => {
      console.log(aru('err-promise'));
      console.log(aru.has('err-promise'));
    });
})();
