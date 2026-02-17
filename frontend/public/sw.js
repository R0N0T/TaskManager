// Service Worker for Web Push Notifications
const SW_VERSION = '1.0.0';

// Handle push events
self.addEventListener('push', function(event) {
    let data = { title: 'Task Suite', body: 'You have a new notification' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body || data.message || 'New notification',
        icon: '/next.svg',
        badge: '/next.svg',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'dismiss', title: 'Dismiss' }
        ],
        tag: 'task-suite-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Task Suite', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(clientList) {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise open a new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});
