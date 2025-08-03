$(document).ready(function() {
    const jsonUrl = 'appModules.json';
    let appModules = [];
    let currentContextModuleIndex = -1;
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    function showToast(message, type = 'success') {
        const toast = $(`
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        `);
        
        $('body').append(toast);
        const toastInstance = new bootstrap.Toast(toast.find('.toast')[0]);
        toastInstance.show();
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    function saveModulesToJson() {
        localStorage.setItem('appModules', JSON.stringify(appModules));
        return Promise.resolve();
    }
    
    function createScreenshotInput(url = '') {
        const id = 'screenshot-' + Math.random().toString(36).substr(2, 9);
        return `
            <div class="input-group mb-2 screenshot-input">
                <input type="url" class="form-control" value="${url}" placeholder="URL Screenshot" required>
                <button class="btn btn-outline-danger" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    function createModuleCard(module, index) {
        let screenshotsHtml = '';
        
        module.screenshots.forEach(ssUrl => {
            screenshotsHtml += `
                <img src="${ssUrl}" class="screenshot-thumbnail" alt="Screenshot" data-bs-toggle="modal" data-bs-target="#screenshotModal">
            `;
        });

        return `
            <div class="col">
                <div class="card h-100" data-url="${module.url}" data-index="${index}">
                    <img src="${module.image}" class="card-img-top" alt="${module.title}">
                    <div class="card-body">
                        <h5 class="card-title">${module.title}</h5>
                        <p class="card-text">${module.description}</p>
                        <div class="screenshot-thumbnail-container">
                            ${screenshotsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadModules() {
        const storedModules = localStorage.getItem('appModules');
        
        if (storedModules) {
            appModules = JSON.parse(storedModules);
            renderModules();
        } else {
            $.getJSON(jsonUrl)
                .done(function(data) {
                    appModules = data;
                    renderModules();
                })
                .fail(function(jqxhr, textStatus, error) {
                    console.error("Error loading modules:", textStatus, error);
                    $('#app-modules').html('<div class="col-12 text-center text-danger"><p>Gagal memuat data modul aplikasi.</p></div>');
                });
        }
    }
    
    function renderModules() {
        $('#app-modules').empty();
        
        if (appModules.length === 0) {
            $('#app-modules').html('<div class="col-12 text-center"><p>Tidak ada modul aplikasi yang tersedia.</p></div>');
            return;
        }
        
        appModules.forEach((module, index) => {
            $('#app-modules').append(createModuleCard(module, index));
        });
    }
    
    function openModuleForm(index = -1) {
        const modal = $('#moduleFormModal');
        const form = $('#moduleForm')[0];
        
        if (index >= 0) {
            const module = appModules[index];
            $('#moduleFormModalLabel').text('Edit Modul');
            $('#moduleIndex').val(index);
            $('#moduleTitle').val(module.title);
            $('#moduleImage').val(module.image);
            $('#moduleDescription').val(module.description);
            $('#moduleUrl').val(module.url);
            
            $('#screenshotsContainer').empty();
            module.screenshots.forEach(url => {
                $('#screenshotsContainer').append(createScreenshotInput(url));
            });
        } else {
            $('#moduleFormModalLabel').text('Tambah Modul Baru');
            form.reset();
            $('#moduleIndex').val('');
            $('#screenshotsContainer').empty();
            $('#screenshotsContainer').append(createScreenshotInput());
        }
        
        modal.modal('show');
    }
    
    function setupContextMenu() {
        $(document).on('contextmenu', '.card', function(e) {
            if (loggedInUser.role !== 'admin') return true;
            
            e.preventDefault();
            currentContextModuleIndex = $(this).data('index');
            
            const menu = $('#contextMenu');
            menu.css({
                display: 'block',
                position: 'absolute',
                left: e.pageX,
                top: e.pageY
            });
            
            return false;
        });
        
        $(document).on('click', function() {
            $('#contextMenu').hide();
        });
    }
    
    loadModules();
    setupContextMenu();
    
    $('#addModuleBtn').on('click', function() {
        openModuleForm();
    });
    
    $('#addScreenshotBtn').on('click', function() {
        $('#screenshotsContainer').append(createScreenshotInput());
    });
    
    $(document).on('click', '.screenshot-input button', function() {
        $(this).closest('.screenshot-input').remove();
    });
    
    $('#saveModuleBtn').on('click', function() {
        const form = $('#moduleForm')[0];
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const index = $('#moduleIndex').val();
        const moduleData = {
            title: $('#moduleTitle').val(),
            image: $('#moduleImage').val(),
            description: $('#moduleDescription').val(),
            url: $('#moduleUrl').val(),
            screenshots: []
        };
        
        $('.screenshot-input input').each(function() {
            const url = $(this).val().trim();
            if (url) moduleData.screenshots.push(url);
        });
        
        if (index === '') {
            appModules.push(moduleData);
            showToast('Modul berhasil ditambahkan!');
        } else {
            appModules[index] = moduleData;
            showToast('Modul berhasil diperbarui!');
        }
        
        saveModulesToJson().then(() => {
            renderModules();
            $('#moduleFormModal').modal('hide');
        });
    });
    
    $('#editModuleBtn').on('click', function() {
        if (currentContextModuleIndex >= 0) {
            openModuleForm(currentContextModuleIndex);
            $('#contextMenu').hide();
        }
    });
    
    $('#deleteModuleBtn').on('click', function() {
        if (currentContextModuleIndex >= 0 && confirm('Apakah Anda yakin ingin menghapus modul ini?')) {
            appModules.splice(currentContextModuleIndex, 1);
            saveModulesToJson().then(() => {
                showToast('Modul berhasil dihapus!', 'danger');
                renderModules();
                $('#contextMenu').hide();
            });
        }
    });
    
    $('#app-modules').on('click', '.card', function() {
        const url = $(this).data('url');
        if (url) window.open(url, '_blank');
    });
    
    $('#app-modules').on('click', '.screenshot-thumbnail', function(e) {
        e.stopPropagation();
        const imageUrl = $(this).attr('src');
        $('#modalScreenshotImage').attr('src', imageUrl);
    });
    
    $('#screenshotModal').on('hidden.bs.modal', function() {
        $('#modalScreenshotImage').attr('src', '');
    });
});
