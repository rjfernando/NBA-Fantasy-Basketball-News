// when clicking on Save Comment btn saves article
$(document).on('click', '.saveBtn', function () {
    // grabs the id associated with the article from the save button
    var articleId = $(this).attr('data-id');
    var btn = $(this);

    // sends a PUT request to save the article
    $.ajax({
        method: 'PUT',
        url: '/article/' + articleId
    }).done(function (data) {
        console.log('Article Saved!')
        btn.removeClass('btn-primary');
        btn.addClass('btn-success');
        btn.text('Saved');
    })
})

// when clicking on Delete Article btn deletes saved article
$(document).on('click', '.deleteBtn', function () {
    // grabs the id associated with the article from the delete button
    var articleId = $(this).attr('data-id');
    var btn = $(this);

    // sends a PUT request to delete the saved article
    $.ajax({
        method: 'PUT',
        url: '/article/delete/' + articleId
    }).done(function (data) {
        console.log('Article Removed!')
        // removes the whole article container
        btn.closest('.article-container').remove();
    })

})

// when clicking on comment btn the review modal pops up with the list of comments
$(document).on('click', '.commentBtn', function () {
    // grabs the id associated with the article from the comment button
    var articleId = $(this).attr('data-id');
    // makes an ajax call for the Article
    $.ajax({
        method: 'GET',
        url: '/article/' + articleId
    })
        // with that done, add the comments to the modal
        .done(function (data) {
            console.log('Gets all Comments!');
            $('#commentTitle').text(data.title);
            $('#saveComment').attr('data-id', data._id);
            $('#comment').empty();
            // gets all comments for one article
            for (var i = 0; i < data.reviews.length; i++) {
                $('#comment').append(`<li class='list-group-item d-flex justify-content-between align-items-center'>` +
                    `${data.reviews[i].body}<a href='#' class='badge badge-pill badge-danger delete-comment' data-id='` +
                    `${data.reviews[i]._id}'>&times;</a></li>`);
            }

        });
});

// when clicking the Submit Comment button
$(document).on('click', '#saveComment', function () {
    // grabs the id associated with the article from the submit button
    var articleId = $(this).attr('data-id');
    // makes a POST request to add the comment, based on the input
    $.ajax({
        method: 'POST',
        url: '/article/' + articleId,
        data: {
            // gets value from comment textarea
            body: $('#bodyinput').val()
        }
    })
        .done(function (data) {
            console.log(data);
            $('#comment').empty();
            // populates comment
            for (var i = 0; i < data.comment.length; i++) {
                $('#comment').append(`<li class='list-group-item d-flex justify-content-between align-items-center'>` +
                    `${data.comment[i].body}<a href='#' class='badge badge-pill badge-danger delete-comment' data-id='` +
                    `${data.comment[i]._id}'>&times;</a></li>`);
            }
        });
    $('#bodyinput').val('');
});

// when clicking on a Delete Comment X button, delete comment
$(document).on('click', '.delete-comment', function () {
    // grabs the id associated with the comment from the x button
    var commentId = $(this).attr('data-id');
    var btn = $(this);
    // makes an ajax call to request deleting a comment 
    $.ajax({
        method: 'DELETE',
        url: '/comment/delete/' + commentId,
    })
        .done(function (data) {
            console.log(data, 'Comment is Deleted!');
            // removes the review container
            btn.parent().remove();
        });
})