var _ = require('lodash');

module.exports = function(RED) {
    function SummariserNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {
            var data = msg.payload;
            
            // create return array
            msg.payload = "";
            var retPayload = _.times(config.rules.length, function() { return msg });
            
            // if msg.payload is an array, process the rules
            if (_.isArray(data)) {
              config.rules.forEach(function(rule, idx) {
                if (rule.op == "sum") {
                  retPayload[idx]["payload"] = _.sumBy(data, rule.field)
                } else if (rule.op == "count") {
                  retPayload[idx]["payload"] = _.map(data, rule.field).length
                } else if (rule.op == "mean") {
                  retPayload[idx]["payload"] = _.meanBy(data, rule.field)
                } else if (rule.op == "group") {
                  retPayload[idx]["payload"] = _.countBy(data, rule.field)
                } else if (rule.op == "join") {
                  retPayload[idx]["payload"] = _.map(data, rule.field).join(rule.sep)
                }
              })
            };
            node.send(retPayload);
        });
    }
    RED.nodes.registerType("summariser",SummariserNode);
}
