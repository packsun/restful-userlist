var userListData = [];
thisUserObject = 0;

$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Update User button click
    $('#btnUpdateUser').on('click', updateUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions

function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    thisUserObject = userListData[arrayPosition];

    // Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

    // Populate fields
    $('#addUser fieldset input#inputUserName').val(thisUserObject.username);
    $('#addUser fieldset input#inputUserEmail').val(thisUserObject.email);
    $('#addUser fieldset input#inputUserFullname').val(thisUserObject.fullname);
    $('#addUser fieldset input#inputUserAge').val(thisUserObject.age);
    $('#addUser fieldset input#inputUserLocation').val(thisUserObject.location);
    $('#addUser fieldset input#inputUserGender').val(thisUserObject.gender);

};

// Add User
function addUser(event) {

    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') {errorCount++;}
    });

    if(errorCount === 0) {

        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                $('#addUser fieldset input').val('');
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        alert('Missing ' + errorCount.toString() + ' fields');
        return false;
    }
};

// Update User
function updateUser(event) {

    event.preventDefault();

    if (thisUserObject != 0) {
        var confirmation = confirm('Are you sure you want to update user: ' + thisUserObject.username + '?');

        if (confirmation) {
            var errorCount = 0;
            $('#addUser input').each(function(index, val) {
                if ($(this).val() === '') {errorCount++;}
            });

            if(errorCount === 0) {

                var updatedUser = {
                    'username': $('#addUser fieldset input#inputUserName').val(),
                    'email': $('#addUser fieldset input#inputUserEmail').val(),
                    'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
                    'age': $('#addUser fieldset input#inputUserAge').val(),
                    'location': $('#addUser fieldset input#inputUserLocation').val(),
                    'gender': $('#addUser fieldset input#inputUserGender').val()
                }

                $.ajax({
                    type: 'PUT',
                    data: updatedUser,
                    url: '/users/adduser/' + thisUserObject._id,
                    dataType: 'JSON'
                }).done(function(response) {
                    if (response.msg === '') {
                        $('#addUser fieldset input').val('');
                        populateTable();
                    }
                    else {
                        alert('Error: ' + response.msg);
                    }
                });
            }
            else {
                alert('Missing ' + errorCount.toString() + ' fields');
                return false;
            }
        }
    } else {
        alert('Please select a valid user first.');
        return false;
    }
}

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            thisUserObject = 0;
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};





