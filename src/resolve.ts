(function () {
    const endsWithFileExtension = /\/?\.[a-zA-Z]{2,}$/;
    const originalResolve = System.constructor.prototype.resolve;
    System.constructor.prototype.resolve = function () {
      const url = originalResolve.apply(this, arguments);
      return endsWithFileExtension.test(url) ? url : url + ".js";
    };
})();