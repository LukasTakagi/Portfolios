const colorInput = document.getElementById("colorpicker");

colorInput.addEventListener("input", (e) => {
    document.body.style.setProperty("--button-color", e.target.value);
});

document.querySelector(".inbox-calendar").addEventListener("click", function () {
    document.querySelector(".calendar-container").classList.toggle("calendar-show");
    document.querySelector(".task-container").classList.toggle("hide");
    document.querySelector(".schedule-bar").classList.toggle("hide");
});

// Constantes de UI
const form = document.querySelector("#todo-form");
const list = document.querySelector("#todo-list");
const buttonAddTodo = document.querySelector("#button-add-todo");
const toggles = document.querySelectorAll(".task-filters > button");

// Enums
const estados = {
    ATIVO: "Ativo",
    COMPLETADO: "Completado"
};

// Obter Dados ao carregar a página
let TODOs = [];
if (localStorage["data"] !== null && localStorage["data"] !== undefined) {
    TODOs = JSON.parse(localStorage["data"]);
}

function construirUI(estado) {
    let HTML = ``;
    let verTODOs = [];

    if (estado === estados.COMPLETADO) {
        verTODOs = TODOs.filter((todo) => todo.completo);
    } else {
        verTODOs = TODOs.filter((todo) => !todo.completo);
    }
    

    if (verTODOs.length === 0) {
        HTML = `<li class="empty">Nada a fazer!</li>`;
    }

    verTODOs.forEach((todo) => {
        if (todo !== null) {
            HTML += `<li id="${todo.id}" style="view-transition-name: list-item-${todo.id};" data-complete="${todo.completo}">
      <span class="text">${todo.titulo}</span>
      <button aria-label="Completo" class="button-complete">
        <svg width="20" height="20" viewBox="0 0 241.44 259.83" class="svg-check">
          <polyline points="16.17 148.63 72.17 225.63 225.17 11.63" pathLength="1" />
        </svg>
      </button>
    </li>`;
        }
    });

    list.innerHTML = HTML;
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    // Não permitir todo vazio
    if (!form[0].value) {
        buttonAddTodo.classList.add("shake");
        return;
    }
    adicionarTodo(evento);
    form.reset();
});

function adicionarTodo() {
    // TODO: Sanitize user input.
    TODOs.push({
        titulo: form[0].value,
        completo: false,
        id: self.crypto.randomUUID()
    });
    localStorage["data"] = JSON.stringify(TODOs);
    buttonAddTodo.classList.add("added");
    construirUI();
}

document.documentElement.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("button-complete")) {
        alternarTodo(evento);
    }
});

list.addEventListener("dblclick", (evento) => {
    const listItem = evento.target.closest("li");

    // Se já estiver editando, deixe estar.
    if (listItem.classList.contains("editing")) return;

    listItem.classList.add("editing");
    const textItem = listItem.querySelector(".text");
    listItem.insertAdjacentHTML(
        "beforeend",
        `<form onsubmit="atualizarTodo(event);" class="form-edit"><input onblur="atualizarTodo(event);" type="text" class="input-edit" value="${textItem.textContent}"></form>`
    );

    const input = listItem.querySelector(".input-edit");
    input.focus();

    // colocar cursor no final do input
    input.setSelectionRange(input.value.length, input.value.length);
});

function atualizarTodo(evento) {
    evento.preventDefault();
    const listItem = evento.target.closest("li");
    const textItem = listItem.querySelector(".text");
    const inputItem = listItem.querySelector(".input-edit");
    const form = listItem.querySelector(".form-edit");
    textItem.textContent = inputItem.value;
    listItem.classList.remove("editing");
    form.remove();
    TODOs = TODOs.map((todo) => {
        if (todo.id === listItem.id) {
            todo.titulo = inputItem.value;
        }
        return todo;
    });
    localStorage["data"] = JSON.stringify(TODOs);
}

function alternarTodo(evento) {
    const listItem = evento.target.parentElement;
    // Trigger complete animation
    listItem.classList.toggle("complete");
    setTimeout(() => {
        if (listItem.dataset.complete === "true") {
            TODOs = TODOs.filter((todo) => !todo.completo);
            if (!document.startViewTransition) {
                construirUI(estados.COMPLETADO);
            } else {
                document.startViewTransition(() => {
                    construirUI();
                });
            }
        } else {
            TODOs.forEach((todo) => {
                if (todo.id === listItem.id) {
                    todo.completo = !todo.completo;
                }
            });
            if (!document.startViewTransition) {
                construirUI(estados.ATIVO);
            } else {
                document.startViewTransition(() => {
                    construirUI();
                });
            }
        }

        localStorage["data"] = JSON.stringify(TODOs);
    }, 1000);
}

toggles.forEach((toggle) => {
    toggle.addEventListener("click", (evento) => {
        toggles.forEach((toggle) => {
            toggle.setAttribute("aria-pressed", false);
        });
        toggle.setAttribute("aria-pressed", true);

        if (toggle.textContent === "Ativas") {
            construirUI(estados.ATIVO);
        } else {
            construirUI(estados.COMPLETADO);
        }        
    });
});


construirUI();


construirUI();


