export default function inputField(type, id, title){
	const fieldDiv = document.createElement('div')
	fieldDiv.className = 'input-field'
	const input = document.createElement('input')
	input.type = type
	input.id = id
	input.required = true
	input.placeholder = ' '
	const label = document.createElement('label')
	label.for = id
	label.textContent = title
	fieldDiv.append(input, label)
	return fieldDiv
}