const version = 1;
const preCacheName = `static-${version}`;
const preCache = ['/'];

self.addEventListener('install', ev => {
    ev.waitUntil(
        caches
            .open(preCacheName)
            .then(cache => {
                console.log('caching the static files');
                cache.addAll(preCache);
            })
            .then(() => self.skipWaiting())
            .catch(console.warn)
    );
});

self.addEventListener('activate', ev => {
    ev.waitUntil(
        caches
            .keys()
            .then(keys => {
                return Promise.all(keys.filter(key => key !== preCacheName).map(key => caches.delete(key)));
            })
            .catch(console.warn)
    );
});

self.addEventListener('fetch', e => {
    if (e.request.url === self.location.origin + '/') {
        e.respondWith(
            caches.open(preCacheName).then(cache => {
                return cache.match(e.request).then(response => {
                    const fetchPromise = fetch(e.request).then(networkResponse => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return response || fetchPromise;
                });
            })
        );
    } else if (navigator.onLine === false && e.request.mode === 'navigate') {
        e.respondWith(
            new Response(
                new Blob([
                    '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><title>آفلاین</title></head><body dir="rtl" style="height:100vh;width:100vw;background-color:#0a0010; overflow:hidden; display:flex; flex-direction:column; align-items: center " ><h2 style="text-align:center; margin-inline:auto;color:#a22; margin-top:30px" >شما آفلاین هستید!</h2><img width={70} height={70} src="/_next/image?url=%2Flogo.png&w=64&q=76" style="margin-top:20px" /><script> setTimeout(()=>{location.href = "/"},2000) </script></body></html>'
                ]),
                {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                }
            )
        );
    }
});



self.addEventListener('push', event => {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/logo.png'
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return self.clients.openWindow('/');
        })
    );
});
