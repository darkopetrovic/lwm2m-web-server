$(function() {

    //$('[data-toggle="tooltip"]').tooltip();

    update_lifetimes($(".lifetime-bar"));

    $('#objects-grid').masonry({
        itemSelector: '.objects-grid-item'
    });

    $(".lwm2m-btn-write").popoverButton({
        target: '#popover-write',
        placement: 'right'
    });

    $(".lwm2m-btn-observe").popoverButton({
        target: '#popover-observe',
        placement: 'right'
    });

    $(".lwm2m-btn-cancel").popoverButton({
        target: '#popover-cancel',
        placement: 'right'
    });

    $("body").on('click', '.lwm2m-btn-write', function(){
        $('#popover-write').popoverX('show');
        // Adjust the position of the popover.
        var btn_pos = $(this).offset();
        $("#popover-write").offset({
            top: btn_pos.top-$("#popover-write").height()/2+$(this).height()/2,
            left: btn_pos.left+35
        });
        $("#popover-write button.lwm2m-btn").attr('id', "btn-write-"+$(this).attr('data-resource'));
    });

    $("body").on('click', '.lwm2m-btn-observe', function(){
        $('#popover-observe').popoverX('show');
        // Adjust the position of the popover.
        var btn_pos = $(this).offset();
        $("#popover-observe").offset({
            top: btn_pos.top-$("#popover-observe").height()/2+$(this).height()/2,
            left: btn_pos.left+35
        });
        $("#popover-observe button.lwm2m-btn").attr('id', "btn-observe-"+$(this).attr('data-resource'));
        $("#popover-observe span.resource-path").text('/'+$(this).attr('data-resource').replace(/[-]/g, '/'));
    });

    $("body").on('click', '.lwm2m-btn-cancel', function(){
       $('#popover-cancel').popoverX('show');
        // Adjust the position of the popover.
        var btn_pos = $(this).offset();
        $("#popover-cancel").offset({
            top: btn_pos.top-$("#popover-cancel").height()/2+$(this).height()/2,
            left: btn_pos.left+35
        });
        $("#popover-cancel button.lwm2m-btn").attr('id', "btn-cancel-"+$(this).attr('data-resource'));
        $("#popover-cancel span.resource-path").text('/'+$(this).attr('data-resource').replace(/[-]/g, '/'));
    });

    /**
     *  Receive resources of instance and add the non-existing in the list.
     *  This action is trigged when the user push the 'discover' button.
     */
    socket.on('discover', function(data) {

        $("#resources-list-"+data.oid+"-"+data.iid)
                .removeClass('opacity-20')
                .prev().remove();

        if(!data.error){
            var resources = $("#resources-list-"+data.oid+"-"+data.iid).children()
            .map(function(){ return parseInt($(this).attr("data-id")) }).toArray();
            var template = APP.Templates["./views/partials/tmpl/resource-row.hbs"];
            $.each(_.difference(data.resources, resources), function(){
                var resid = this;
                $.get('/objects-db/resource/'+data.oid+'/'+this, function(result){
                    if(!result.resource){
                        var rid = resid;
                    } else {
                        var rid = result.resource.id;
                    }

                    var context = {
                        oid: data.oid,
                        iid: data.iid,
                        rid: rid,
                        r: result.resource
                    };
                    $("#resources-list-"+data.oid+"-"+data.iid).append(template(context));
                    $('#objects-grid').masonry();
                });
            });

        }
    });

    /**
     * Receive observation response. Add the observation row dynamically in the interface.
     */
    socket.on('observe', function(data) {
        if(!data.error){
            // toggle 'observe' button appearance
            var btn = $(".lwm2m-btn-observe[data-resource="+data.oid+"-"+data.iid+"-"+data.rid+"]");
            btn.removeClass('btn-default lwm2m-btn-observe').addClass('btn-warning lwm2m-btn-cancel');
            btn.find("span").removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
            btn.attr('data-target', '#popover-cancel');

            if( !$("#observations-list #observation-"+data.oid+"-"+data.iid+"-"+data.rid).length ){
                var template = APP.Templates["./views/partials/tmpl/observation-row.hbs"];
                $.get('/objects-db/resource/'+data.oid+'/'+data.rid, function(result){
                    var context = {
                        resource: "/"+data.oid+"/"+data.iid+"/"+data.rid,
                        object_shortname: result.object.shortname,
                        resource_shortname: result.resource.shortname
                    };
                    $("#observations-list").append(template(context));
                });
            }

            toastr.success("New observation for resource <span class='resource-path'>/"+
                data.oid+"/"+data.iid+"/"+data.rid+"</span> on device <b>"+data.did+"</b>", 'Observation');
        } else {
            toastr.error("Could't add observation. Error message: '"+data.error.message+"'", 'Observation');
        }
    });


    socket.on('cancelObservation', function(data) {
        if(!data.error){
            // toggle 'observe' button appearance
            var btn = $(".lwm2m-btn-cancel[data-resource="+data.oid+"-"+data.iid+"-"+data.rid+"]");
            btn.removeClass('btn-warning lwm2m-btn-cancel').addClass('btn-default lwm2m-btn-observe');
            btn.find("span").removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
            btn.attr('data-target', '#popover-observe');
            $('#observation-'+data.oid+"-"+data.iid+"-"+data.rid).remove();

            toastr.warning("Observation canceled for resource <span class='resource-path'>/"+
                data.oid+"/"+data.iid+"/"+data.rid+"<span>", 'Observation');
        } else {
            toastr.error("Could't cancel observation", 'Observation');
        }
    });

    socket.on('execute', function(data) {
        if (!data.error) {
            $("#value-" + data.oid + "-" + data.iid + "-" + data.rid).text("OK")
                .removeClass('loader-small error');
        } else {
            $("#value-" + data.oid + "-" + data.iid + "-" + data.rid)
                .text(data.error.name).removeClass('loader-small')
                .addClass('error');
        }
    });


    /**
     * Catch user click on buttons with 'lwm2m-btn' class.
     * The function is reading the id attribute which could be like that:
     *      btn-read-3303-0-5700
     *      btn-discover-3303-0
     *      ...
     * The button informations are sent to the nodejs server via the opened socket.
     */
    $("body").on('click', '.lwm2m-btn', function () {
        var btn_infos = $(this).attr('id').split('-');
        var deviceId = $("#device-id").attr('data-id');

        /* handle all popover close */
        $("div[id^='popover']").popoverX('hide');

        var infos = {
            action: btn_infos[1],
            did: parseInt(deviceId),
            oid: btn_infos[2] ? parseInt(btn_infos[2]) : null,
            iid: btn_infos[3] ? parseInt(btn_infos[3]) : "",
            rid: btn_infos[4] ? parseInt(btn_infos[4]) : ""
        };

        // add the payload
        if(infos.action == "write"){
            infos.value = $(this).parent().prev().find('input').val();
            $(this).parent().prev().find('input').val('');
        }

        socket.emit('user', infos);

        // ----- Rendering --------

        if(infos.action == "read" || infos.action == "write" || infos.action == "execute"){
            addLoader(infos.oid, infos.iid, infos.rid);
        }

        if( infos.action == "discover"){
            /* we don't want to add a loader for the value of the resource when we
            * discover attribute of a resource (not implemented yet) */
            addLoader(infos.oid, infos.iid, null);
        }

    });

    start_lifetime_decrease();

});


function addLoader(oid, iid, rid){
    if(rid !== "" && rid !== null){
        $("#value-"+oid+"-"+iid+"-"+rid).text('');
        $("#value-"+oid+"-"+iid+"-"+rid).addClass('loader-small');
    } else {
        if(iid !== "" && iid !== null){

            var resources_list = $("#resources-list-"+oid+"-"+iid);

            var size = resources_list.height() < 20 ?  20 : resources_list.height();
            if(size>100){
                size=100;
            }
            var border_size = size == 20 ? 3 : 10;

            $("#resources-list-"+oid+"-"+iid)
            .addClass('opacity-20')
            .before('<div class="loader-medium loader-top-centered" id="loader-'+oid+'-'+iid+'"></div>');

            $("#loader-"+oid+"-"+iid).css('height', size+'px');
            $("#loader-"+oid+"-"+iid).css('width', size+'px');
            $("#loader-"+oid+"-"+iid).css('border', border_size+'px solid #e4e4e4');
            $("#loader-"+oid+"-"+iid).css('border-top', border_size+'px solid #706f75');
            $("#loader-"+oid+"-"+iid).css('margin-left', '-'+size/2+'px');
            $("#loader-"+oid+"-"+iid).css('margin-top', ''+(resources_list.height()-size)/2+'px');

        }
    }
}

function reassignPopover(select)
{
    $(select).popoverButton({
        target: '#popover-cancel',
        placement: 'right'
    }).click(function(){
        /* Adjust the position of the popover. */
        var btn_pos = $(this).offset();
        $("#popover-cancel").offset({
            top: btn_pos.top-$("#popover-cancel").height()/2+$(this).height()/2,
            left: btn_pos.left+35
        });
        $("#popover-cancel button.lwm2m-btn").attr('id', "btn-cancel-"+$(this).attr('data-resource'));
        $("#popover-cancel span.resource-path").text('/'+$(this).attr('data-resource').replace(/[-]/g, '/'));
    });
}