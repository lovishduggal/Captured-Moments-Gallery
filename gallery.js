/**
 * This function sets a timeout to execute database transactions and DOM manipulations after 100 milliseconds.
 * It retrieves video and image data from IndexedDB and dynamically creates media elements in the DOM.
 */
setTimeout(() => {
    if (db) {
        // Transaction and retrieval for video data
        const videoDBTransaction = db.transaction('video', 'readonly');
        const videoStore = videoDBTransaction.objectStore('video');
        const videoRequest = videoStore.getAll();

        videoRequest.onsuccess = (e) => {
            const videos = videoRequest.result;
            const body = document.querySelector('body');

            videos.forEach((video) => {
                const mediaElem = document.createElement('div');
                mediaElem.classList.add('class', 'media-wrapper');
                mediaElem.setAttribute('id', video.id);
                mediaElem.innerHTML = ` <div class="media-cont">
                <div class="media-img-vid">
                    <video autoplay loop controls src="${URL.createObjectURL(
                        video.blob
                    )}"></video>
                </div>
                <div class="download action-btn">Download</div>
                <div class="delete action-btn">Delete</div>
            </div>`;
                body.appendChild(mediaElem);

                const deleteBtn = mediaElem.querySelector('.delete');
                deleteBtn.addEventListener('click', deleteListener);
                const downloadBtn = mediaElem.querySelector('.download');
                downloadBtn.addEventListener('click', downloadListener);
            });
        };

        // Transaction and retrieval for image data
        const imageDBTransaction = db.transaction('image', 'readonly');
        const imageStore = imageDBTransaction.objectStore('image');
        const imageRequest = imageStore.getAll();

        imageRequest.onsuccess = (e) => {
            const images = imageRequest.result;
            const body = document.querySelector('body');

            images.forEach((image) => {
                const mediaElem = document.createElement('div');
                mediaElem.classList.add('class', 'media-wrapper');
                mediaElem.setAttribute('id', image.id);
                mediaElem.innerHTML = ` <div class="media-cont">
                <div class="media-img-vid">
                 <image src="${image?.url}" />
                </div>
                <div class="download action-btn">Download</div>
                <div class="delete action-btn">Delete</div>
            </div>`;
                body.appendChild(mediaElem);

                const deleteBtn = mediaElem.querySelector('.delete');
                deleteBtn.addEventListener('click', deleteListener);
                const downloadBtn = mediaElem.querySelector('.download');
                downloadBtn.addEventListener('click', downloadListener);
            });
        };
    }
}, 100);

function deleteListener(e) {
    const id = e.target.parentElement.parentElement.getAttribute('id');
    if (id.slice(0, 3) === 'vid') {
        const videoDBTransaction = db.transaction('video', 'readwrite');
        const videoStore = videoDBTransaction.objectStore('video');
        videoStore.delete(id);
    } else if (id.slice(0, 3) === 'img') {
        const imageDBTransaction = db.transaction('image', 'readwrite');
        const imageStore = imageDBTransaction.objectStore('image');
        imageStore.delete(id);
    }

    e.target.parentElement.parentElement.remove();
}
function downloadListener(e) {
    const id = e.target.parentElement.parentElement.getAttribute('id');
    if (id.slice(0, 3) === 'vid') {
        const videoDBTransaction = db.transaction('video', 'readwrite');
        const videoStore = videoDBTransaction.objectStore('video');
        const videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            const video = videoRequest.result;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(video.blob);
            a.download = 'video.mp4';
            a.click();
        };
    } else if (id.slice(0, 3) === 'img') {
        const imageDBTransaction = db.transaction('image', 'readwrite');
        const imageStore = imageDBTransaction.objectStore('image');
        const imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            console.log(id.slice(0, 3));
            const image = imageRequest.result;
            const a = document.createElement('a');
            a.href = image.url;
            a.download = 'image.jpg';
            a.click();
        };
    }
}
