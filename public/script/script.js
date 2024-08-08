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
    
    const exampleInput = createLabeledInput('Input', `input_example_${Date.now()}`, 'Enter input');
    li.appendChild(exampleInput.label);
    li.appendChild(exampleInput.input);

    const exampleOutput = createLabeledInput('Output', `output_example_${Date.now()}`, 'Enter output');
    li.appendChild(exampleOutput.label);
    li.appendChild(exampleOutput.input);

    const exampleExplanation = createLabeledInput('Explanation', `explanation_example_${Date.now()}`, 'Enter explanation');
    li.appendChild(exampleExplanation.label);
    li.appendChild(exampleExplanation.input);

    document.getElementById('input_example').appendChild(li);
}

// Function to add a new constraint input field
let constraintCount = 1;
function addConstraint() {
    const li = document.createElement('li');
    li.classList.add('input-element');

    const constraintInput = createLabeledInput(`Constraint ${constraintCount}`, `constraint_${constraintCount}`, `Enter constraint ${constraintCount}`);
    // li.appendChild(constraintInput.label);
    li.appendChild(constraintInput.input);

    document.getElementById('input_constraint').appendChild(li);
    constraintCount++;
}

// Function to add a new algorithm step input field
let algorithmStepCount = 1;
function addAlgorithmSteps() {
    const li = document.createElement('li');
    li.classList.add('input-element');

    const algorithmStepInput = createLabeledInput(`Step ${algorithmStepCount}`, `algorithm_step_${algorithmStepCount}`, `Enter step ${algorithmStepCount}`);
    // li.appendChild(algorithmStepInput.label);
    li.appendChild(algorithmStepInput.input);

    document.getElementById('input_algorithm').appendChild(li);
    algorithmStepCount++;
}

// Add event listeners to buttons (assumes button elements exist with specific IDs)
document.getElementById('add_example_btn').addEventListener('click', addExample);
document.getElementById('add_constraint_btn').addEventListener('click', addConstraint);
document.getElementById('add_algorithm_step_btn').addEventListener('click', addAlgorithmSteps);
