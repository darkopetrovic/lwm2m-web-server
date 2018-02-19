var socket = null;

function updateAllProgressBarColor(){

    $.each($(".progress-bar"), function(i, e){
        var valuemax = parseInt($(e).attr('aria-valuemax'));
        var valuenow = parseInt($(e).attr('aria-valuenow'));
        var percentage = valuenow/valuemax*100;
        $(e).css('width', percentage+'%');
        adjustProgressBarColor($(e), percentage);
    });
}

function adjustProgressBarColor(bar, percentage)
{
    bar
        .removeClass('progress-bar-danger')
        .removeClass('progress-bar-warning')
        .removeClass('progress-bar-primary')
        .removeClass('progress-bar-success');

    if(percentage>=80){
        bar.addClass('progress-bar-success');
    } else if(percentage>50 && percentage<80){
        bar.addClass('progress-bar-primary');
    } else if (percentage>15 && percentage <= 50){
        bar.addClass('progress-bar-warning');
    } else if (percentage <= 15){
        bar.addClass('progress-bar-danger');
    }
}

function start_lifetime_decrease(){
    var second_timer = setInterval(function(){
        $.each($(".lifetime-bar"), function(i, e){
            var valuemax = parseInt($(e).attr('aria-valuemax'));
            var valuenow = parseInt($(e).attr('aria-valuenow'));
            $(e).attr('aria-valuenow', valuenow-1);
            $(e).html(valuenow-1);
            var percentage = (valuenow-1)/valuemax*100;
            if (valuenow <= 0)
               $(e).css('width', '100%');
            else
               $(e).css('width', percentage+'%');

            if(percentage>50 && percentage<80){
                $(e).removeClass('progress-bar-success').addClass('progress-bar-primary');
            } else if (percentage>15 && percentage <= 50){
                $(e).removeClass('progress-bar-primary').addClass('progress-bar-warning');
            } else if (percentage>0 && percentage <= 15){
                $(e).removeClass('progress-bar-warning').addClass('progress-bar-danger');
            }
        });
    }, 1000);
}

function update_lifetimes(e){
    var lastseen_string = $(e).parents('.device-details').find('.lastseen').html();
    var lastseen = moment(lastseen_string+" +0000", "DD.MM.YYYY HH:mm:ss Z");
    var now = moment().utc();
    var elapsed = Math.round(moment.duration(now.diff(lastseen)).asSeconds());
    var valuemax = parseInt($(e).attr('aria-valuemax'));
    $(e).attr('aria-valuenow', valuemax-elapsed);
    $(e).html(valuemax-elapsed);
    var percentage = (valuemax-elapsed)/valuemax*100;
    $(e).css('width', percentage+'%');
}

$(function() {

    socket = io.connect('/');
    socket.on('connect', function(data) {
        socket.emit('join', 'Hello from client');
    });

    socket.on('unregistration', function(device){
        var device_name = $("#device-card-grid .device-card-title[data-name='"+device.name+"']");
        if(device_name){
            var grid_element = device_name.parents('.device-grid-item');
            $('#device-card-grid').masonry('remove', grid_element).masonry('layout');
            toastr.info('Device has been unregistered: <b>'+device.name+'<b>', 'Unregistration');
        }
    });

    socket.on('new-registration', function(device){
        var device_name = $("#device-card-grid .device-card-title[data-name='"+device.name+"']");
        if(device_name){
            var grid_element = device_name.parents('.device-grid-item');
            $('#device-card-grid').masonry('remove', grid_element).masonry('layout');
            toastr.info('Device has re-registered: <b>'+device.name+'<b>', 'Registration');
        } else {
            toastr.info('New device has registered: <b>'+device.name+'<b>', 'Registration');
        }
        var template = APP.Templates["./views/partials/tmpl/device-card.hbs"];
        var $grid_item = $('<div class="device-grid-item">'+template(device)+'</div>');
        $('#device-card-grid').append($grid_item).masonry( 'appended', $grid_item );
    });

    socket.on('update-registration', function(device){
        toastr.info('Device <b>'+device.id+'</b> has updated its registration (' +
            'Lt='+device.lifetime + ', B='+device.binding+')', 'Update Registration');

        var lifetime_bar = $("#lifetime-bar-"+device.id);
        lifetime_bar.attr('aria-valuenow', device.lifetime);
        lifetime_bar.attr('aria-valuemax', device.lifetime);
        lifetime_bar.css('width', '100%');
        lifetime_bar
            .removeClass('progress-bar-danger')
            .removeClass('progress-bar-warning')
            .removeClass('progress-bar-primary')
            .addClass('progress-bar-success');

        $("#address-"+device.id).html( device.address );
        $("#port-"+device.id).html( device.port );
        $("#binding-box-"+device.id).html(device.binding);
        $("#creationdate-"+device.id).html( moment(device.createDate).utc().format(DateFormats['short']) );
        $("#lastseen-"+device.id).html( moment(device.lastSeen).utc().format(DateFormats['short']) );

    });

    socket.on('response', function(data) {

        if($("#resources-list-"+data.oid+"-"+data.iid).hasClass('opacity-20')){
            $("#resources-list-"+data.oid+"-"+data.iid)
                .removeClass('opacity-20')
                .prev().remove();
        }

        if(data.rid !== "") {
            if (!data.error) {
                $("#value-" + data.oid + "-" + data.iid + "-" + data.rid).text(data.value)
                    .removeClass('loader-small error');

                // update graphical representation when present on the page
                var bar = $("#device-card-"+data.did+" #bar-" + data.oid + "-" + data.iid + "-" + data.rid);
                if(bar.length) {
                    var valuemax = bar.attr('aria-valuemax');
                    bar.attr('aria-valuenow', data.value);
                    bar.html(data.value+'%');
                    var percentage = parseInt(data.value)/valuemax*100;
                    bar.css('width', percentage+'%');
                    adjustProgressBarColor(bar, percentage);
                }

            } else {
                $("#value-" + data.oid + "-" + data.iid + "-" + data.rid)
                    .text(data.error.name).removeClass('loader-small')
                    .addClass('error');
            }
        } else if (data.rid === ""){
            if (!data.error) {
                var instance_data = JSON.parse(data.value);
                _.each(instance_data.e, function(e){
                    $("#value-" + data.oid + "-" + data.iid + "-" + e.n).text(e[Object.keys(e)[1]])
                        .removeClass('loader-small error');
                });
            } else {

            }
        }
    });

    updateAllProgressBarColor();


    // highlight nav bar button based on current page
    $(".navbar-nav .active").removeClass("active");

    if(location.pathname == "/" || location.pathname == "/device"){
        $(".navbar-nav").find("a[href='/']").parent().addClass("active");
    } else if (location.pathname == "/observations") {
        $(".navbar-nav").find("a[href='/observations']").parent().addClass("active");
    } else if (location.pathname == "/objects-db" || location.pathname == "/device-models") {
        $(".navbar-nav").find("#settings").parent().addClass("active");
    }

});
