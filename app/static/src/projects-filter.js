document.querySelector('.filter-button').addEventListener('click', function(){
    var filterBlocks = document.querySelectorAll('.filter-block');
    var filtersCategory = [];
    var projects = document.querySelectorAll('.project_list_item');
    filterBlocks.forEach((elem, index) => {
        filtersCategory.push([]);
        var selectedValues = elem.querySelectorAll('input[type="checkbox"]:checked');
        selectedValues.forEach((value) => { filtersCategory[index].push(value.getAttribute('name'))});
    });
    projects.forEach(project => {
        visible = true;
        projectFilters = project.getAttribute('name').split(" ");
        filtersCategory.forEach((filter, index) => {
            if (filter.length !== 0 && !filter.includes(projectFilters[index])){
                visible *= false;
            }
        });
        project.style.display = visible ? 'block' : 'none';
    });
});

document.querySelector('.filter-cancel-button').addEventListener('click', function(){
    document.querySelectorAll('input[type="checkbox"]:checked').forEach( elem => {
        elem.checked = false;
    });
    document.querySelectorAll('.project_list_item').forEach(project =>{
        project.style.display = 'block';
    });
});

document.querySelectorAll('.filter-block h3').forEach(name => {
    name.addEventListener('click', () =>{
        var next = name.nextElementSibling;
        next.style.display =  next.style.display === 'none' ? 'block' : 'none';
    });
});