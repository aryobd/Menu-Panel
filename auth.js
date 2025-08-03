$(document).ready(function() {
    function checkLogin(username, password) {
        return new Promise((resolve, reject) => {
            $.getJSON('users.json')
                .done(function(users) {
                    const user = users.find(u => 
                        u.username === username && u.password === password
                    );
                    
                    if (user) {
                        resolve({
                            success: true,
                            user: user
                        });
                    }
                    else {
                        resolve({
                            success: false,
                            message: "Username atau password salah"
                        });
                    }
                })
                .fail(function() {
                    reject({
                        success: false,
                        message: "Gagal memuat data pengguna"
                    });
                });
        });
    }
    
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...');
        
        $('#loginMessage').removeClass('text-danger text-success').html('');
        
        checkLogin(username, password)
            .then(result => {
                if (result.success) {
                    $('#loginMessage').addClass('text-success').html('Login berhasil!');
                    
                    sessionStorage.setItem('loggedInUser', JSON.stringify(result.user));
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    $('#loginMessage').addClass('text-danger').html(result.message);
                    submitBtn.prop('disabled', false).html('Login');
                }
            })
            .catch(error => {
                $('#loginMessage').addClass('text-danger').html(error.message);
                submitBtn.prop('disabled', false).html('Login');
            });
    });
});