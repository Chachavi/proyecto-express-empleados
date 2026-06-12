const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login.html';
}

loadEmployees();

async function loadEmployees() {

    const response = await fetch('/employees', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const employees = await response.json();

    const body = document.getElementById('employeesBody');

    body.innerHTML = '';

    employees.forEach(employee => {

        body.innerHTML += `
            <tr>

                <td>${employee.first_name}</td>
                <td>${employee.last_name}</td>
                <td>${employee.email ?? ''}</td>
                <td>${employee.phone ?? ''}</td>
                <td>${employee.address ?? ''}</td>

                <td>

                    <button class="btn btn-warning btn-sm"
                            onclick='editEmployee(${JSON.stringify(employee)})'>

                        Editar

                    </button>

                    <button class="btn btn-danger btn-sm"
                            onclick="deleteEmployee(${employee.employee_id})">

                        Eliminar

                    </button>

                </td>

            </tr>
        `;
    });
}

function logout() {

    localStorage.removeItem('token');

    window.location.href = '/login.html';
}

async function saveEmployee() {

    const employeeId = document.getElementById('employeeId').value;

    const employee = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('employeeEmail').value,
        address: document.getElementById('address').value
    };

    let url = '/employees';
    let method = 'POST';

    // Si hay ID, estamos editando
    if (employeeId) {
        url = `/employees/${employeeId}`;
        method = 'PUT';
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        alert('Error al guardar empleado');
        return;
    }

    // Cerrar modal
    bootstrap.Modal.getInstance(
        document.getElementById('employeeModal')
    ).hide();

    clearForm();

    loadEmployees();
}

function clearForm() {

    document.getElementById('employeeId').value = '';

    document.getElementById('firstName').value = '';

    document.getElementById('lastName').value = '';

    document.getElementById('phone').value = '';

    document.getElementById('employeeEmail').value = '';

    document.getElementById('address').value = '';
}

function editEmployee(employee) {

    document.getElementById('employeeId').value =
        employee.employee_id;

    document.getElementById('firstName').value =
        employee.first_name;

    document.getElementById('lastName').value =
        employee.last_name;

    document.getElementById('phone').value =
        employee.phone ?? '';

    document.getElementById('employeeEmail').value =
        employee.email ?? '';

    document.getElementById('address').value =
        employee.address ?? '';

    new bootstrap.Modal(
        document.getElementById('employeeModal')
    ).show();
}

async function deleteEmployee(id) {

    const confirmDelete =
        confirm('¿Eliminar empleado?');

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(
        `/employees/${id}`,
        {
            method: 'DELETE',

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        alert('Error al eliminar');

        return;
    }

    loadEmployees();
}

async function searchEmployee() {

    const name =
        document.getElementById('searchInput').value;

    if (!name.trim()) {

        loadEmployees();

        return;
    }

    const response = await fetch(
        `/employees/search/${name}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const employees =
        await response.json();

    const body =
        document.getElementById('employeesBody');

    body.innerHTML = '';

    employees.forEach(employee => {

        body.innerHTML += `
            <tr>

                <td>${employee.first_name}</td>

                <td>${employee.last_name}</td>

                <td>${employee.email ?? ''}</td>

                <td>${employee.phone ?? ''}</td>

                <td>${employee.address ?? ''}</td>

                <td>

                    <button class="btn btn-warning btn-sm"
                            onclick='editEmployee(${JSON.stringify(employee)})'>

                        Editar

                    </button>

                    <button class="btn btn-danger btn-sm"
                            onclick="deleteEmployee(${employee.employee_id})">

                        Eliminar

                    </button>

                </td>

            </tr>
        `;
    });
}