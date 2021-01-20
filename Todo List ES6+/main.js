const app = document.querySelector("#app");

app.innerHTML = `
<div class="container">
<button class="night" onClick="ladoOscuro()">Cambiar Estilo!</button> 
</div>
<div class="todos">
    <div class="todos-header">
        <h3 class="todos-title">Mi próximo movimiento</h3>
        <div>
        <p>Tenés <span class= "todos-count"></span> movimientos por realizar! </p>
            <button type="button" class="todos-clear" style="display:none;">Borrar completados</button>
        </div>    
    </div>  
    <form class="todos-form" name="todos">
        <input type="text" placeholder="¿Qué vas a hacer?" name="todo">
        <small>Escribilo acá</small>
    </form>
    <ul class="todos-list">
    </ul>
</div>
`;

// LOCAL STORAGE! para guardar los todos.
const saveInLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// SELECTORES -> elementos que seleccionamos del HTML
const root = document.querySelector('.todos'); //el div del app
const list = root.querySelector('.todos-list'); //el ul
const count = root.querySelector('.todos-count'); // para mostrar en el P 
const clear = root.querySelector('.todos-clear'); // button del p
const form = document.forms.todos; // los forms
const input = form.elements.todo; // los todo
const tecla = document.querySelector('.container');

// STATE DE LOS TODOS 
let state = JSON.parse(localStorage.getItem('todos')) || [];

// FUNCION QUE REDERIZA LOS TODOS
const renderTodos = (todos) => {
    let todosListHTML = todos.map((todo, index) => `
    <li data-id="${index}"${todo.complete ? ' class="todos-complete"' : ''}>
        <input type="checkbox"${todo.complete ? ' checked' : ''}>
        <span>${todo.label}</span>
        <button type="button"></button>
    </li>    
    `).join('');
    list.innerHTML = todosListHTML;
    clear.style.display = todos.filter((todo) => todo.complete).length ?
        'block' :
        'none';
    count.innerText = todos.filter((todo) => !todo.complete).length;
};

// HANDLERS


//MODIFICA STATE DE LA APP 
const addTodo = (e) => {
    e.preventDefault();
    const label = input.value.trim();
    const complete = false;

    // Si NO HAY NADA EN EL LABEL -> ERROR
    if (label.length === 0) {
        form.classList.add('error');
        return;
    }
    form.classList.remove('error');
    state = [...state, { label, complete }];
    renderTodos(state);
    saveInLocalStorage(state);
    console.log(state);
    input.value = '';
}

const updateTodo = ({ target }) => {
    // Obtiene la posicion en el array del todo
    const id = parseInt(target.parentNode.dataset.id);
    const complete = target.checked;
    state = state.map((todo, index) => {
        if (index === id) {
            return {
                ...todo,
                complete,
            };
        }
        return todo;
    });
    console.log(state);
    renderTodos(state);
    saveInLocalStorage(state);
};


// EDITAR EL TODO HACIENDOLE DBLCLICK
const editTodo = ({ target }) => {
    if (target.nodeName !== 'SPAN') {
        return
    }
    const id = parseInt(target.parentNode.dataset.id);
    const currentLabel = state[id].label;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentLabel;

    // Un handler de evento 
    const handlerEdit = (event) => {
        const label = event.target.value;
        event.stopPropagation();
        if (label !== currentLabel) {
            state = state.map((todo, index) => {
                if (index === id) {
                    return {
                        ...todo,
                        label,
                    };
                }
                return todo;
            });
            renderTodos(state);
            saveInLocalStorage(state);
        }
        event.target.display = '';
        event.target.removeEventListener('change', handlerEdit);
    };

    input.addEventListener('change', handlerEdit);

    target.parentNode.append(input);
    input.focus();
};

const deleteTodo = ({ target }) => {
    if (target.nodeName !== 'BUTTON') {
        return;
    }
    const id = parseInt(target.parentNode.dataset.id);
    const label = target.previousElementSibling.innerText;
    if (window.confirm(`Ey, estás por eliminar ${label}, ¿continuar?`)) {
        state = state.filter((todo, index) => index !== id);
        renderTodos(state);
        saveInLocalStorage(state);
    }
};

const clearCompletes = (e) => {
    const todoCompletes = state.filter((todo) => todo.complete).length;
    if (todoCompletes === 0) {
        return;
    }
    if (window.confirm(`Vas a borrar los ${todoCompletes}, seguro?`)) {
        state = state.filter((todo) => !todo.complete);
        renderTodos(state);
        saveInLocalStorage(state);
    }
};

// LADO OSCURO

const ladoOscuro = () => {
    console.log('Convirtiendo al lado oscuro...');
    document.querySelector('.todos ').classList.toggle("lado-oscuro");
    document.querySelector('.todos-list').classList.toggle("lado-oscuro");
    document.querySelector('.todos-form').classList.toggle("lado-oscuro");
    document.querySelector('.todos-title').classList.toggle("lado-oscuro");
};


// INIT FUNCTION -> Inicio de la app

function init() {
    renderTodos(state);
    form.addEventListener('submit', addTodo);
    list.addEventListener('change', updateTodo);
    list.addEventListener('dblclick', editTodo);
    list.addEventListener('click', deleteTodo);
    clear.addEventListener('click', clearCompletes);
}

init();