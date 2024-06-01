let db;
const openRequest = indexedDB.open('captured-moments', 1);
openRequest.addEventListener('upgradeneeded', (e) => {
    db = openRequest.result;
    db.createObjectStore('video', { keyPath: 'id' });
    db.createObjectStore('image', { keyPath: 'id' });
});

openRequest.addEventListener('success', (e) => {
    console.log('successfully');
    db = openRequest.result;
});

openRequest.addEventListener('error', (e) => {
    console.log('error');
});
