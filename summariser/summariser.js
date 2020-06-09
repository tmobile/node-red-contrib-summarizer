var _ = require('lodash');

module.exports = function(RED) {
    function SummariserNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.input = config.input || "payload";
        this.inputType = config.inputType || "msg";
        this.output = config.output || "payload";

        node.on('input', function(msg) {
            var data = RED.util.evaluateNodeProperty(this.input, // "payload"
              this.inputType, // "msg", "flow", "global"
              node, msg);

            // if msg.payload is an array, process the rules
            if (_.isArray(data)) {
              var retMsg = [];
              config.rules.forEach((rule, idx) => {
                var rm = RED.util.cloneMessage(msg);
                if (rule.op == "sum") {
                  rm[this.output] = _.sumBy(data, rule.field)
                } else if (rule.op == "count") {
                  rm[this.output] = _.map(data, rule.field).length
                } else if (rule.op == "mean") {
                  rm[this.output] = _.meanBy(data, rule.field)
                } else if (rule.op == "group") {
                  rm[this.output] = _.countBy(data, rule.field)
                } else if (rule.op == "join") {
                  rm[this.output] = _.map(data, rule.field).join(rule.sep)
                } else if (rule.op == "extract") {
                  rm[this.output] = _.map(data, rule.field)
                } else if (rule.op == "cat") {
                  rm[this.output] = _.groupBy(data, rule.field)
                };
                retMsg.push(rm);
              })
            } else {
              var retMsg = _.times(config.rules.length, function() { return RED.util.cloneMessage(msg) });
            };
            node.send(retMsg);
        });
    }
    RED.nodes.registerType("summariser",SummariserNode);
}
