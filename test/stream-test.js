var meshlet = require("../");
var through = require("through2");
var expect  = require("expect.js");
var _ = require("highland");

describe(__filename + "#", function() {

  it("can write a stream of operations", function(next) {
    var results = [];

    function db(operation) {
      return _([operation]);
    }

    var stream = meshlet.open(db);
    stream.on("data", function(data) {
      results.push(data);
    });

    stream.on("end", function() {
      expect(results[0].name).to.be("insert");
      expect(results[1].name).to.be("load");
      expect(results[2].name).to.be("remove");
      next();
    });

    stream.write(meshlet.operation("insert"));
    stream.write(meshlet.operation("load"));
    stream.end(meshlet.operation("remove"));
  });
});
