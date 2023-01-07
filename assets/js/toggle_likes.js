// creating a toggle likes when a link is clicekd, using AJAX
class ToggleLike {
    constructor(toggleElement) {
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike() {
        $(this.toggler).click(function(e) {
            e.preventDefault();
            let self = this;

            // this is a new way of wirting a ajax which you might have studied, it looks the as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount, data.data.deleted);
                
                if(data.data.deleted == true) {
                    likesCount -= 1;
                } else {
                    likesCount += 1;
                }

                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });
    }
}