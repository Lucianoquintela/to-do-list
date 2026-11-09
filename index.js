const overlay = document.querySelector("#overlay");
const criarTarefa = document.querySelector("#criarTarefa");
const lista = document.querySelector("#lista");
const titulo = document.querySelector("#titulo");
const descricao = document.querySelector("#descricao");
const busca = document.querySelector("#busca");

function abrirModal() {
    overlay.classList.add("active");
    criarTarefa.classList.add("active");
}

function fecharModal() {
    overlay.classList.remove("active");
    criarTarefa.classList.remove("active");
}

function buscarTarefas() {
    fetch("http://localhost:3000/tarefas")
        .then(res => {
            if (!res.ok) {
                throw new Error("Erro ao buscar tarefas");
            }

            return res.json();
        })
        .then(res => {
            inserirTarefas(res);
        })
        .catch(error => console.error(error));
}

buscarTarefas();

// Inserir tarefas na tela
function inserirTarefas(listaDeTarefas) {
    lista.innerHTML = "";

    const mensagem = document.querySelector("#tarefas h6");

    mensagem.style.display = listaDeTarefas.length > 0
        ? "none"
        : "block";

    listaDeTarefas.forEach(tarefa => {
        lista.innerHTML += `
            <li>
                <h5>${tarefa.titulo}</h5>

                <p>${tarefa.descricao}</p>

                <div class="actions">
                    <box-icon
                        name="trash"
                        size="md"
                        onclick='deletarTarefa("${tarefa.id}")'>
                    </box-icon>
                </div>
            </li>
        `;
    });
}

function novaTarefa(event) {
    event.preventDefault();

    let tarefa = {
        titulo: titulo.value,
        descricao: descricao.value
    };

    fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erro ao criar tarefa");
        }

        return res.json();
    })
    .then(res => {
        console.log("Tarefa criada:", res);

        fecharModal();

        let form = document.querySelector("#criarTarefa form");

        form.reset();

        buscarTarefas();
    })
    .catch(error => console.error(error));
}

function deletarTarefa(id) {
    fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erro ao excluir tarefa");
        }

        console.log("Tarefa excluída com sucesso!");

        buscarTarefas();
    })
    .catch(error => console.error(error));
}

function pesquisarTarefas() {
    let lis = document.querySelectorAll("#lista li");

    if (busca.value.length > 0) {
        lis.forEach(li => {
            if (!li.children[0].innerText.toLowerCase()
                .includes(busca.value.toLowerCase())) {

                li.classList.add("oculto");

            } else {
                li.classList.remove("oculto");
            }
        });

    } else {
        lis.forEach(li => {
            li.classList.remove("oculto");
        });
    }
}
