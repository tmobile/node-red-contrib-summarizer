var _ = require('lodash');

module.exports = function(RED) {
    function SummariserNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {
            // create empty return array
            var retPayload = _.times(config.rules.length, function() { return {payload: ""}});
            var data = msg.payload;

            // if msg.payload is an array, process the rules
            if (_.isArray(data)) {
              config.rules.forEach(function(rule, idx) {
                retPayload[idx] = {payload: rule.field}
                if (rule.op == "sum") {
                  retPayload[idx] = {payload: _.sumBy(data, rule.field)}
                } else if (rule.op == "count") {
                  retPayload[idx] = {payload: _.map(data, rule.field).length}
                } else if (rule.op == "mean") {
                  retPayload[idx] = {payload: _.meanBy(data, rule.field)}
                } else if (rule.op == "group") {
                  retPayload[idx] = {payload: _.countBy(data, rule.field)}
                }
              })
            };
            node.send(retPayload);
        });
    }
    RED.nodes.registerType("summariser",SummariserNode);
}
