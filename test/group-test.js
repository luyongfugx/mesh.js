var mesh = require("../");
var expect  = require("expect.js");
var through = require("through2");
var _       = require("highland");

describe(__filename + "#", function() {

  it("can push a new event bus handler at the end", function(next) {

    var bus = mesh.first(
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))
    );

    bus.add(mesh.accept("b", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    })));

    bus.add(mesh.accept("a", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    })));

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(1);
      bus(mesh.op("b")).on("data", function(data) {
        expect(data).to.be(2);
        next();
      });
    });
  });

  it("can push a new event bus handler at the beginning", function(next) {

    var bus = mesh.first(
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))
    );

    bus.add(mesh.accept("a", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    })), -Infinity);

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(2);
      next();
    });
  });

  it("can remove a bus", function(next) {

    var bus = mesh.first(
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      }))
    );

    var a2 = mesh.accept("a", mesh.wrapCallback(function(operation, next) {
      next(void 0, 2);
    }));

    bus.add(a2, -Infinity);

    bus(mesh.op("a")).on("data", function(data) {
      expect(data).to.be(2);
      bus.remove(a2);
      bus(mesh.op("a")).on("data", function(data) {
        expect(data).to.be(1);
        next();
      });
    });
  });

  it("can add multiple busses", function(next) {
    var bus = mesh.parallel();
    bus.add(
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 1);
      })),
      mesh.accept("a", mesh.wrapCallback(function(operation, next) {
        next(void 0, 2);
      }))
    );

    bus(mesh.op("a")).
    pipe(_.pipeline(_.collect)).
    on("data", function(data) {
      expect(data[0]).to.be(1);
      expect(data[1]).to.be(2);
      next();
    });
  });

});
