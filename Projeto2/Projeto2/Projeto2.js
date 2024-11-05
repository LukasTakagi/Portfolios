$("form").validate({
    rules: {
        username: {
            required: true,
            minlength: 2
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        username: {
            required: "Por favor, insira o nome de usuário.",
            minlength: "O nome de usuário deve ter pelo menos 2 caracteres."
        },
        password: {
            required: "Por favor, insira a senha.",
            minlength: "A senha deve ter pelo menos 6 caracteres."
        }
    }
});


function togglePassword() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eye-icon");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}
