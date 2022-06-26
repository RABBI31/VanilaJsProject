
window.addEventListener('load', () => {
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const list_el = document.querySelector("#tasks");

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const task = input.value;

		const task_el = document.createElement('div');
		task_el.classList.add('task');

		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');

		task_el.appendChild(task_content_el);

		const task_input_el = document.createElement('input');
		task_input_el.classList.add('text');
		task_input_el.type = 'text';
		task_input_el.value = task;
		task_input_el.setAttribute('readonly', 'readonly');

		task_content_el.appendChild(task_input_el);

		const task_actions_el = document.createElement('div');
		task_actions_el.classList.add('actions');
		
		const task_edit_el = document.createElement('button');
		task_edit_el.classList.add('edit');
		task_edit_el.innerText = 'Edit';

		const task_delete_el = document.createElement('button');
		task_delete_el.classList.add('delete');
		task_delete_el.innerText = 'Delete';

		task_actions_el.appendChild(task_edit_el);
		task_actions_el.appendChild(task_delete_el);

		task_el.appendChild(task_actions_el);

		list_el.appendChild(task_el);

		input.value = '';

		task_edit_el.addEventListener('click', (e) => {
			if (task_edit_el.innerText.toLowerCase() == "edit") {
				task_edit_el.innerText = "Save";
				task_input_el.removeAttribute("readonly");
				task_input_el.focus();
			} else {
				task_edit_el.innerText = "Edit";
				task_input_el.setAttribute("readonly", "readonly");
			}
		});

		task_delete_el.addEventListener('click', (e) => {
			list_el.removeChild(task_el);
		});
	});
	document.querySelector('#myInputFile').addEventListener("change", function (){
		const reader = new FileReader();
		reader.addEventListener("load", ()=>{
			localStorage.setItem('recent-image', reader.result);
		});
		reader.readAsDataURL(this.files[0]);
	});
	document.addEventListener("DOMContentLoaded", ()=>{
		const recentImageDataUrl = localStorage.getItem("recent-image");
		

		if(recentImageDataUrl){
			document.querySelector("#imgPreview").setAttribute("src", recentImageDataUrl);
			
		}
	});

	// video uploader
	
});
var uppy = Uppy.Core({
	debug: false,
	autoProceed: true,
	restrictions: {
	  maxFileSize: 1024 * 1024 * 200,
	  allowedFileTypes: ['video/*'],
	}
  })
  uppy.use(Uppy.Dashboard, { 
	inline: true,
	height: 300,
	target: '#drag-drop-area'
  })
  uppy.use(Uppy.Transloadit, {
	params: {
	  auth: {
		// To avoid tampering use signatures:
		// https://transloadit.com/docs/api/#authentication
		key: 'f2ca8cb9fd8c4251b886bf7481bb271d'
	  },
	  template_id: 'c9a74860adcf4e76b355deb8a2a3be36'
	},
	waitForEncoding: true
})

uppy.on('complete', result => {
  console.log('successful files:', result.successful)
  console.log('failed files:', result.failed)
});
// Adding image
let dropBox = document.getElementById('dropBox');

	// modify all of the event types needed for the script so that the browser
	// doesn't open the image in the browser tab (default behavior)
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
		dropBox.addEventListener(evt, prevDefault, false);
	});
	function prevDefault (e) {
		e.preventDefault();
		e.stopPropagation();
	}

	// remove and add the hover class, depending on whether something is being
	// actively dragged over the box area
	['dragenter', 'dragover'].forEach(evt => {
		dropBox.addEventListener(evt, hover, false);
	});
	['dragleave', 'drop'].forEach(evt => {
		dropBox.addEventListener(evt, unhover, false);
	});
	function hover(e) {
		dropBox.classList.add('hover');
	}
	function unhover(e) {
		dropBox.classList.remove('hover');
	}

	// the DataTransfer object holds the data being dragged. it's accessible
	// from the dataTransfer property of drag events. the files property has
	// a list of all the files being dragged. put it into the filesManager function
	dropBox.addEventListener('drop', mngDrop, false);
	function mngDrop(e) {
		let dataTrans = e.dataTransfer;
		let files = dataTrans.files;
		filesManager(files);
	}

	
	function upFile(file) {
		let imageType = /image.*/;
		if (file.type.match(imageType)) {
			let url = 'HTTP/HTTPS URL TO SEND THE DATA TO';
			let formData = new FormData();
			formData.append('file', file);
			fetch(url, {
				method: 'put',
				body: formData
			})
			.then(response => response.json())
			.then(result => { console.log('Success:', result); })
			.catch(error => { console.error('Error:', error); });
		} else {
			console.error("Only images are allowed!", file);
		}
	}
	function previewFile(file) {
		let imageType = /image.*/;
		if (file.type.match(imageType)) {
			let fReader = new FileReader();
			let gallery = document.getElementById('gallery');
			fReader.readAsDataURL(file);
			fReader.onloadend = function() {
				let wrap = document.createElement('div');
				let img = document.createElement('img');
				img.src = fReader.result;
				let imgCapt = document.createElement('p');
				let fSize = (file.size / 1000) + ' KB';
				imgCapt.innerHTML = `<span class="fName">${file.name}</span><span class="fSize">${fSize}</span><span class="fType">${file.type}</span>`;
				gallery.appendChild(wrap).appendChild(img);
				gallery.appendChild(wrap).appendChild(imgCapt);
			}
		} else {
			console.error("Only images are allowed!", file);
		}
	}
	function filesManager(files) {
		files = [...files];
		files.forEach(upFile);
		files.forEach(previewFile);
	}