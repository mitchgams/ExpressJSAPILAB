/*********
 * this is a bad solution for santizing messes up bad on 
 * the modular edit. 
 */
function sanitize(string) {
    const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;'};
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

$('#send-chirp').click(() => {
    let name = sanitize($('#name').val());
    let text = sanitize($('#content').val());
    if(name === "" || text === "") {
        alert("enter name and content to post");
    } else {
        $.ajax({
            type: "POST",
            url: "./api/chirps",
            data: JSON.stringify({user: name, text: text}),
            success: console.log("ok"),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        });

        /************
         * decided to reload everything rather than
         * prepending the chirp. 
         */
        loadChirps();
    }
});

$('#saveChirp').click(() => {
    let id = $('#chirpId').val();
    let name = sanitize($('#editUser').val());
    let text = sanitize($('#chirpEditContent').val());
    $.ajax({
        type: "PUT",
        url: `./api/chirps/edit/${id}`,
        data: JSON.stringify({user: name, text: text}),
        success: console.log("ok"),
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });

    /********************
     * update client data
     */
    $(`#chirper-user${id}`).text($('#editUser').val());
    $(`#chirper-text${id}`).text($('#chirpEditContent').val());
});


let loadChirps = async() => {
    $('#chirp-container').empty();
    let response = await fetch("./api/chirps/");
    let chirps = await response.json();
    let chirpCount = chirps['nextid'];
    nextId = chirpCount;
    for(let i = 0; i < chirpCount; i++) {
        if(chirps[i] !== undefined) {
            let div = $(commentBlock(chirps[i].user, chirps[i].text, i));
            $('#chirp-container').prepend(div);

            /***************
             * Delete Button
             */
            $(`#${i}`).click(() => {
                div.remove();
                deleteChirp(i);
            });

            /*************
             * Edit Module
             */
            $(`#edit${i}`).click(async() => {
                response = await fetch(`./api/chirps/${i}`);
                let chirp = await response.json();
                $('#editUser').val(chirp.user);
                $('#chirpEditContent').val(chirp.text);
                $('#chirpId').val(i);
                console.log(chirp.text);
            })
        }
    }
}
loadChirps();

function deleteChirp(id) {
    $.ajax({
        type: "DELETE",
        url: `./api/chirps/delete/${id}`,
        success: console.log("attempting")
    });
}

function commentBlock(name, text, id=0) {
    return (`<div class='card mb-3'>
                <div class='card-header p-0 pl-1'>
                    <div class='row'>
                        <div class='col'>
                            <h5 class='mt-3 better-font' id='chirper-user${id}'>${name}</h5>
                        </div>
                        <div class='col float-right'>
                            <button class='btn m-0 btn-secondary btn-small float-right' id='${id}'>X</button>
                        </div>
                    </div>
                </div>
                <div class='card-body p-2'>
                    <p class='card-text' id='chirper-text${id}'>
                        ${text}
                    </p>
                    <p class='p-0 m-0 float-right'>
                        <a data-toggle="modal" data-target="#chirp-edit" id="edit${id}" href="#">[edit]</a>
                    </p>
                </div>
            </div>`);
}