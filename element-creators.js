import { ColorizeSourceType, ColorizeTargetType } from "./index.js";
import { linkInputColorTextPicker } from "./utils.js";

/** @typedef {{value: any, text: string, description: string}} DropdownOptionObject */

/**
 * 
 * @param {string} templateId 
 * @param {boolean?} deep 
 * @returns {DocumentFragment}
 */
export function createTemplateClone(templateId, deep) {
    const tpl = /** @type {HTMLTemplateElement} */ (document.getElementById(templateId));
    return /** @type {DocumentFragment} */ (tpl.content.cloneNode(deep));
}

/**
 * @param {(textboxValue: string) => string?} textboxValueProcessor 
 * @param {(colorHex: string) => void} onColorChanged 
 * @returns 
 */
export function createColorTextPickerCombo(textboxValueProcessor, onColorChanged) {
    const textInput = document.createElement('input');
    textInput.className = "text_pole textarea_compact";
    textInput.type = "text";

    const pickerInput = document.createElement('input');
    pickerInput.className = "dc-color-picker";
    pickerInput.type = "color";

    const pickerWrapper = document.createElement('div');
    pickerWrapper.className = "dc-color-picker-wrapper";
    pickerWrapper.appendChild(pickerInput);

    const wrapper = document.createElement('div');
    wrapper.className = "dc-color-input-combo";
    wrapper.appendChild(pickerWrapper);
    wrapper.appendChild(textInput);

    linkInputColorTextPicker(pickerInput, textInput, textboxValueProcessor, onColorChanged);
    return wrapper;
}

/**
 * 
 * @param {string} id The ID to set on the created elements.
 * @param {DropdownOptionObject[]} optionObjects 
 * @param {string=} labelText The string for the label.
 * @param {string=} description The help text for the label and contents.
 * @param {((event: Event) => void)=} onChangedCallback The 'onchange' callback to add to the dropdown.
 * @returns {HTMLDivElement} The div containing the label and dropdown.
 */
export function createDropdownWithLabel(id, optionObjects, labelText, description, onChangedCallback) {
    const dropdownLabel = document.createElement('label');
    dropdownLabel.htmlFor = id;
    dropdownLabel.innerHTML = labelText;
    if (description) {
        dropdownLabel.title = description;
        dropdownLabel.innerHTML += `<span class="margin5 fa-solid fa-circle-info opacity50p"></span>`;
    }

    const dropdown = document.createElement('select');
    dropdown.id = id;
    dropdown.name = id;
    optionObjects.forEach((optionObj) => {
        const elemOption = document.createElement('option');
        elemOption.value = optionObj.value;
        elemOption.title = optionObj.description;
        elemOption.innerHTML = optionObj.text;
        dropdown.appendChild(elemOption);
    })

    if (onChangedCallback) {
        dropdown.addEventListener('change', onChangedCallback);
    }

    const wrapper = document.createElement('div');
    wrapper.appendChild(dropdownLabel);
    wrapper.appendChild(dropdown);
    return wrapper;
}

/**
 * 
 * @param {string} id The ID to set on the created elements.
 * @param {((event: Event) => void)=} onChangedCallback The 'onchange' callback to add to the dropdown.
 * @returns {HTMLDivElement} The div containing the label and dropdown.
 */
export function createColorSourceDropdown(id, onChangedCallback) {
    const options = [
        {
            value: ColorizeSourceType.AVATAR_VIBRANT, 
            text: "Avatar Vibrant", 
            description: "Use a vibrant color dynamically calculated from the character's avatar."
        },
        {
            value: ColorizeSourceType.STATIC_COLOR, 
            text: "Static Color", 
            description: "Use a specified static color."
        },
        {
            value: ColorizeSourceType.CHAR_COLOR_OVERRIDE, 
            text: "Per-Character Only", 
            description: "Use the default quote color except for characters with a specified override color."},
    ];

    return createDropdownWithLabel(id, options, "Color Source", "The source to use for dialogue color.", onChangedCallback);
}

export function createColorTargetCheckboxes(onChangedCallback) {
    const targets = [
        { value: ColorizeTargetType.BUBBLES, text: "Chat Bubbles", description: "Color the chat bubbles. Only works with the 'Bubbles' chat style." },
        { value: ColorizeTargetType.QUOTED_TEXT, text: "Quoted Text", description: "Color quoted text." },
        { value: ColorizeTargetType.UNQUOTED_TEXT, text: "Unquoted Text", description: "Color unquoted text." }
    ];

    const wrapper = document.createElement('div');
    wrapper.className = "dc-color-targets";

    targets.forEach(target => {
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.value = target.value.toString();
        checkbox.id = `xdc-target_${target.value}`;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.innerHTML = target.text;
        if (target.description) {
            label.title = target.description;
            label.innerHTML += `<span class="margin5 fa-solid fa-circle-info opacity50p"></span>`;
        }

        const container = document.createElement('div');
        container.appendChild(checkbox);
        container.appendChild(label);

        wrapper.appendChild(container);

        checkbox.addEventListener('change', onChangedCallback);
    });

    return wrapper;
}