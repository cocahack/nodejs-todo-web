const Middleware = function()  {
  const middlewareContainer = [];
  let _req, res;

  const add = (path, fn) => {
    if(typeof path === 'string'){
      fn.basePath = path;
      const boundRun = fn.run.bind(fn);
      middlewareContainer.push(boundRun);
    } else {
      // In this branch, Path is a callback function.
      middlewareContainer.push(path);
    }
  };

  const _run = (index, err) => {
    if (index < 0 || index >= middlewareContainer.length) return;

    const nextMw = middlewareContainer[index];
    const next = err => _run(index + 1, err);

    if (err) {
      const isNextErrorMw = nextMw.length === 4

      return isNextErrorMw ?
        nextMw(err, _req, _res, next) :
        _run(i + 1, err)
    }

    nextMw(_req, _res, next);
  }

  const run = (req, res) => {
    _req = req;
    _res = res;
    _run(0);
  };

  return {
    add,
    run,
  }
};


module.exports = Middleware;