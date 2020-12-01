/*********
 * this is a bad solution for santizing.
 * it messes up bad on the modular edit. 
 */
function sanitize(string) {
    const map = {'<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;'};
    const reg = /[<>"'/]/ig;
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
    const data = await response.json();
    let chirpCount = data['nextid'];
    nextId = chirpCount;
    const chirps = Object.keys(data).map(key => {
        return {
            id: key,
            ...data[key]
        }
    });
    chirps.pop();
    //for(chirp of chirps) {  // whoopsie scopsie 
    chirps.forEach(chirp => {
        let div = $(commentBlock(chirp));
            $('#chirp-container').prepend(div);

            $(`#${chirp.id}`).click(() => {
                div.remove();
                deleteChirp(chirp.id);
            });
            $(`#edit${chirp.id}`).click(() => {
                $('#editUser').val(chirp.user);
                $('#chirpEditContent').val(chirp.text);
                $('#chirpId').val(chirp.id);
                console.log(chirp.text);
            })
        });
    console.log(chirps);

    /*
    for(let i = 0; i < chirpCount; i++) {
        if(chirps[i] !== undefined) {
            
        }
    }*/
}
loadChirps();

function deleteChirp(id) {
    $.ajax({
        type: "DELETE",
        url: `./api/chirps/delete/${id}`,
        success: console.log("attempting")
    });
}

function commentBlock(chirp) {
    return (`<div class='card mb-3'>
                <div class='card-header p-0 pl-1'>
                    <div class='row'>
                        <div class='col'>
                            <h5 class='mt-3 better-font' id='chirper-user${chirp.id}'>${chirp.user}</h5>
                        </div>
                        <div class='col float-right'>
                            <button class='btn m-0 btn-secondary btn-small float-right' id='${chirp.id}'>X</button>
                        </div>
                    </div>
                </div>
                <div class='card-body p-2'>
                    <p class='card-text' id='chirper-text${chirp.id}'>
                        ${chirp.text}
                    </p>
                    <p class='p-0 m-0 float-right'>
                        <a data-toggle="modal" data-target="#chirp-edit" id="edit${chirp.id}" href="#">[edit]</a>
                    </p>
                </div>
            </div>`);
}