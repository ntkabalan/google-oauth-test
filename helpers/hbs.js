const moment = require('moment');

module.exports = {
    truncate: (str, len) => {
        if (str.length > len && str.length > 0) {
            let result = str + ' ';
            result = str.substring(0, len);
            result = str.substring(0, str.lastIndexOf(' '));
            result = (result.length > 0) ? result : str.substring(0, len);
            return result + '...';
        }
        return str;
    },
    stripHtmlTags: (str) => {
        return str.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: (date, format) => {
        return moment(date).format(format);
    },
    select: (selected, options) => {
        return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },
    editIcon: (storyUser, currentUesr, storyId, floating = true) => {
        if (storyUser == currentUesr) {
            if (floating) {
                return `
                <a href="/stories/edit/${storyId}" class="btn-floating halfway-fab center-align red">
                    <i class="fas fa-pencil-alt"></i>
                </a>
                `
            } else {
                return `
                <a href="/stories/edit/${storyId}" class="center-align">
                    <i class="fas fa-pencil-alt"></i>
                </a>
                `
            }
        } else {
            return ''
        }
    }
}