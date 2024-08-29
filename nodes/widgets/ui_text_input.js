const datastore = require('../store/data.js')
const statestore = require('../store/state.js')
const { appendTopic } = require('../utils/index.js')

module.exports = function (RED) {
    function TextInputNode (config) {
        // create node in Node-RED
        RED.nodes.createNode(this, config)
        const node = this

        // which group are we rendering this widget
        const group = RED.nodes.getNode(config.group)

        const evts = {
            beforeSend: async function (msg) {
                const updates = msg.ui_update
                if (updates) {
                    if (typeof updates.label !== 'undefined') {
                        // dynamically set "label" property
                        statestore.set(group.getBase(), node, msg, 'label', updates.label)
                    }
                    if (typeof updates.mode !== 'undefined') {
                        // dynamically set "mode" property
                        statestore.set(group.getBase(), node, msg, 'mode', updates.mode)
                    }
                    if (typeof updates.clearable !== 'undefined') {
                        // dynamically set "clearable" property
                        statestore.set(group.getBase(), node, msg, 'clearable', updates.clearable)
                    }
                    if (typeof updates.icon !== 'undefined') {
                        // dynamically set "icon" property
                        statestore.set(group.getBase(), node, msg, 'icon', updates.icon)
                    }
                    if (typeof updates.iconPosition !== 'undefined') {
                        // dynamically set "icon position" property
                        statestore.set(group.getBase(), node, msg, 'iconPosition', updates.iconPosition)
                    }
                    if (typeof updates.iconInnerPosition !== 'undefined') {
                        // dynamically set "icon inner position" property
                        statestore.set(group.getBase(), node, msg, 'iconInnerPosition', updates.iconInnerPosition)
                    }
                }
                msg = await appendTopic(RED, config, node, msg)
                return msg
            },
            onInput: function (msg, send) {
                // store the latest msg passed to node
                datastore.save(group.getBase(), node, msg)
                // only send msg on if we have passthru enabled
                if (config.passthru) {
                    send(msg)
                }
            }
        }

        // inform the dashboard UI that we are adding this node
        group.register(node, config, evts)

        node.on('close', async function (done) {
            done()
        })
    }

    RED.nodes.registerType('ui-text-input', TextInputNode)
}
