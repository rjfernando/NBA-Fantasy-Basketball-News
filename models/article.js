const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({

    title: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    },
    
    link: {
        type: String,
        required: true
    },

    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    
    saved: {
    type: Boolean,
    default: false
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;