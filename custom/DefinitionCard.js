class DefinitionCard extends HTMLElement {

    constructor () {
        super()
    }

    connectedCallback () {

        const container = document.createElement('div')
        container.setAttribute('class', 'word-card')
        
        const cardHeader = container.appendChild(document.createElement('div'))
        cardHeader.setAttribute('class', 'd-flex justify-content-between align-items-center mb-2')

        const cardTitle = cardHeader.appendChild(document.createElement('p'))
        cardTitle.setAttribute('class', 'card-title')
        cardTitle.innerText = this.hasAttribute('card-title')
        ? this.getAttribute('card-title') 
        : 'Título não encontrado'

        const dropdown = cardHeader.appendChild(document.createElement('div'))
        dropdown.setAttribute('class', 'dropdown')
        
        const optionsButton = dropdown.appendChild(document.createElement('button'))
        optionsButton.setAttribute('class', 'btn-opcoes dropdown-toggle')
        optionsButton.setAttribute('type', 'button')
        optionsButton.setAttribute('data-bs-toggle', 'dropdown')
        optionsButton.setAttribute('aria-expanded', 'false')
        optionsButton.innerText = 'OPÇÕES'

        const dropdownMenu = dropdown.appendChild(document.createElement('ul'))
        dropdownMenu.setAttribute('class', 'dropdown-menu dropdown-menu-end')

        const editButton_li = dropdownMenu.appendChild(document.createElement('li'))

        const editButton = editButton_li.appendChild(document.createElement('button'))
        editButton.setAttribute('class', 'dropdown-item option-edit')
        editButton.setAttribute('data-bs-toggle', 'modal')
        editButton.setAttribute('data-bs-target', '#editModal')
        editButton.setAttribute('name', 'edit-button')
        editButton.innerText = '✏️ Editar'

        const deleteButton_li = dropdownMenu.appendChild(document.createElement('li'))

        const deleteButton = deleteButton_li.appendChild(document.createElement('button'))
        deleteButton.setAttribute('class', 'dropdown-item text-danger option-delete')
        deleteButton.setAttribute('data-bs-toggle', 'modal')
        deleteButton.setAttribute('data-bs-target', '#deleteModal')
        deleteButton.setAttribute('name', 'delete-button')
        deleteButton.innerText = '🗑️ Deletar'

        const cardBody = container.appendChild(document.createElement('div'))
        cardBody.setAttribute('class', 'card-body-content ps-2')

        const subWord = cardBody.appendChild(document.createElement('div'))
        subWord.setAttribute('class', 'sub-word mb-1')
        subWord.innerText = this.hasAttribute('card-sub-word')
        ? this.getAttribute('card-sub-word')
        : 'Sub-palavra não encontrada'
        
        const description = cardBody.appendChild(document.createElement('p'))
        description.setAttribute('class', 'description')
        description.innerText = this.hasAttribute('card-description')
        ? this.getAttribute('card-description')
        : 'Descrição não encontrada'
        
        this.append(container)

    }
}

customElements.define('definition-card', DefinitionCard)