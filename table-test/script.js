const table = document.getElementById('root')
const filterRadio = document.getElementById('filter_radio')

const state = {
    showInactive: false,
    selectedParents: [0]
}

const getFilteredData = () => {

    const result = data.filter(el => el.parentId === 0)

    if (state.showInactive) {
        return result
    } else {
        return result.filter(el => el.isActive)
    }
}

const buildRow = (item) => {
    const children = data.filter(e => e.parentId === item.id)
    const hasChildren = children.length > 0
    const hasParent = item.parentId > 0

    const showRow = state.selectedParents.includes(item.id)
    
    let className = ''

    if (hasChildren) {
        className = className + ' child-row'
    }
    if (hasParent) {
        className = className + ' parent-row'
    }
    
    const actionText = !showRow ? '&#x21CA open  list &#x21CA' : `&#x21c8 close list &#x21c8`

    return `
        <div
            id="row_${item.id}" 
            class="custom-table__row ${className}"
        >
            <div class="custom-table__cell area-name">${item.name}</div>
            <div class="area-balance">${item.balance}</div>
            <div class="custom-table__cell area-isActive">${item.isActive}</div>
            <div 
                class="custom-table__cell area-action ${hasChildren ? 'row-action' : ''}" 
                data-name="${item.id}"
            >
                ${hasChildren ? actionText : ''}
            </div>
            <div class="area-child  ${!showRow ? 'collapsed' : ''}">${hasChildren ? children.map(ele => buildRow(ele)).join("") : ''}</div>
        </div>
    `
}

const render = () => {
    table.innerHTML = getFilteredData().map(item => {
            return buildRow(item)
        }).join("")

    rebuildListeners()
}

const toggleParentId = event => {
    const id = parseInt(event.target.dataset.name)

    if (!state.selectedParents.includes(id)) {
        state.selectedParents.push(id)
    } else {
        state.selectedParents = state.selectedParents.filter(e => e !== id)
    }

    render()
}

const rebuildListeners = () => {
    const items = document.querySelectorAll('.row-action') 

    for (let i = 0; i < items.length; i++) {
        
        items[i].addEventListener('click', toggleParentId)
    }
}

filterRadio.addEventListener('click', () => {
    filterRadio.checked = !state.showInactive
    state.showInactive = !state.showInactive
    render()
})

render()