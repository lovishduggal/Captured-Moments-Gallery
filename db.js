let db;
const openRequest = indexedDB.open('captured-moments', 1);
/**
 * Event listener for the 'upgradeneeded' event on the openRequest.
 * This event is triggered when a new version of the database is being created or an upgrade is needed.
 *
 * @param {Event} e - The event object.
 */
openRequest.addEventListener('upgradeneeded', (e) => {
    // Get the database instance from the open request result
    db = openRequest.result;

    // Create an object store for 'video' with 'id' as the key path
    db.createObjectStore('video', { keyPath: 'id' });

    // Create an object store for 'image' with 'id' as the key path
    db.createObjectStore('image', { keyPath: 'id' });
});

/**
 * Event listener for the 'success' event of the openRequest.
 * This event is triggered when the database connection is successfully opened.
 *
 * @param {Event} e - The event object.
 */
openRequest.addEventListener('success', (e) => {
    db = openRequest.result;
    console.log('Database connection successful');
});

/**
 * Adds an event listener for the 'error' event on the openRequest object.
 * When an error occurs, it logs 'error' to the console.
 *
 * @param {Event} e - The event object representing the error event.
 */
openRequest.addEventListener('error', (e) => {
    console.error('Error in opening database');
});
