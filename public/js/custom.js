$('.menuDelete').on('click', function (event) {
    event.preventDefault();
    var id = $(this).attr('href');
    var data = {
        id: id
    }

    $.ajax({
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/admin/bot-menu/delete',
    }).done(function (data) {
        if (data.ok) {
            $(location).attr('href', '/admin/bot-menu');
        } else {
            alert('Ochirib bolmadi');
        }
    });
});