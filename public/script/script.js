// Utility function to create labeled input elements
function createLabeledInput(labelText, inputId, placeholder) {
    const label = document.createElement('label');
    label.setAttribute('for', inputId);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', inputId);
    input.setAttribute('name', inputId);
    input.setAttribute('placeholder', placeholder);
    input.required = true;

    return { label, input };
}

// Function to add a new example input-output pair
function addExample() {
    const li = document.createElement('li');
    li.classList.add('input-element');
    
    const exampleInput = createLabeledInput('Input', `input`, 'Enter input');
    li.appendChild(exampleInput.label);
    li.appendChild(exampleInput.input);

    const exampleOutput = createLabeledInput('Output', `output`, 'Enter output');
    li.appendChild(exampleOutput.label);
    li.appendChild(exampleOutput.input);

    const exampleExplanation = createLabeledInput('Explanation', `explanation`, 'Enter explanation');
    li.appendChild(exampleExplanation.label);
    li.appendChild(exampleExplanation.input);

    document.getElementById('input_example').appendChild(li);
}

// Function to add a new constraint input field
let constraintCount = 2;
function addConstraint() {
    const li = document.createElement('li');
    li.classList.add('input-element');

    const constraintInput = createLabeledInput(`Constraint ${constraintCount}`, `constraints`, `Enter constraint ${constraintCount}`);
    // li.appendChild(constraintInput.label);
    li.appendChild(constraintInput.input);

    document.getElementById('input_constraint').appendChild(li);
    constraintCount++;
}

// Function to add a new algorithm step input field
function addAlgorithmSteps() {
    const li = document.createElement('li');
    li.classList.add('input-element');

    const algorithmStepInput = createLabeledInput(`algorithms`, `algorithms`, `Enter next step`);
    // li.appendChild(algorithmStepInput.label);
    li.appendChild(algorithmStepInput.input);

    document.getElementById('input_algorithm').appendChild(li);
}

// making navbar responsive
const navbar = document.querySelector('.links');
function myfun() {
    navbar.classList.toggle('hide');
}

// listings script
document.addEventListener('DOMContentLoaded', () => {
    // <script>
        const difficultyBox = document.getElementById('difficulty');
        const filterBox = document.getElementById('filter');
        const searchBox = document.getElementById('search');
        const paginationBox = document.getElementById('pagination');

        (function changePage() {
            const buttons = paginationBox.getElementsByClassName('curr-page-btn')
            for (let button of buttons) {
                button.addEventListener('click', () => {
                    const current_page = button.textContent;
                    const url = new URL(window.location.href);
                    url.searchParams.set('page', current_page);
                    window.history.pushState({}, '', url);
                    window.location.href = url;
                })
            }

            const previous = paginationBox.querySelector('.previous');
            const next = paginationBox.querySelector('.next');
            const total_hidden_btn = paginationBox.querySelectorAll("input[type='hidden']");
            let total_page = total_hidden_btn[0].value;

            previous.addEventListener('click', () => {
                const url = new URL(window.location.href);
                let current_page = url.searchParams.get('page') || 1;
                current_page -= 1
                if (current_page < 1) {
                    current_page = Number(total_page);
                }
                url.searchParams.set('page', current_page);
                window.history.pushState({}, '', url);
                window.location.href = url;
            });

            next.addEventListener('click', () => {
                const url = new URL(window.location.href);
                let current_page = Number(url.searchParams.get('page'));
                current_page += 1;
                if (current_page > Number(total_page)) {
                    current_page = 1;
                }
                url.searchParams.set('page', current_page);
                window.history.pushState({}, '', url);
                window.location.href = url;
            })

        })()

        function fetchData() {
            const value = searchBox.value.trim();
            // localStorage.setItem('searchValue', value);

            const tableContent = document.getElementsByTagName('table')[0];
            const tbody = tableContent.getElementsByTagName('tbody')[0];
            const trows = tbody.getElementsByTagName('tr');

            for (let row of trows) {
                const td = row.getElementsByTagName('td')[0];
                const td_text = td.textContent.toLowerCase();

                if (!td_text.includes(value.toLowerCase())) {
                    row.classList.add('hide');
                } else {
                    row.classList.remove('hide');
                }

            }
        }



        function updateURL() {
            const difficulty = difficultyBox.value;
            const filter = filterBox.value;

            const url = new URL(window.location.href);

            // Update URL parameters
            if (difficulty) {
                url.searchParams.set('difficulty', difficulty);
            } else {
                url.searchParams.delete('difficulty');
            }

            if (filter) {
                url.searchParams.set('filter', filter);
            } else {
                url.searchParams.delete('filter');
            }
            // Push the new URL without reloading the page
            window.history.pushState({}, '', url);
            window.location.href = url
        }
        difficultyBox.addEventListener('change', updateURL);
        filterBox.addEventListener('change', updateURL);
        searchBox.addEventListener('input', fetchData);
        // paginationBox.addEventListener('mouseover', changePage);


    // {/* </script> */}
})