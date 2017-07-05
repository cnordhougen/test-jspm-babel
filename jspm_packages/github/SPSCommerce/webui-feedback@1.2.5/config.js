module.exports = {

    remove: {
        duration: 300
    },

    flash: {
        duration: 5000
    },

    default: 'info', // which type to use if none is specified

    types: {

        info: {
            label: 'webui.components.feedback.fyi',
            icon: 'fa-info-circle'
        },
        warning: {
            label: 'webui.components.feedback.warning',
            icon: 'fa-exclamation-triangle'
        },
        success: {
            label: 'webui.components.feedback.success',
            icon: 'fa-check'
        },
        error: {
            label: 'webui.components.feedback.error',
            icon: 'fa-exclamation-circle'
        },
        tip: {
            label: 'webui.components.feedback.proTip',
            icon: 'fa-lightbulb-o'
        }
    }
};
