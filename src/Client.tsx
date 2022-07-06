import React from "react";
import App from './App';
import {createRoot, hydrateRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import { loadableReady } from '@loadable/component'
import {serviceWorkerPath} from "../config/routes";

loadableReady(() => {
    const container = document.getElementById('root') as HTMLElement
    const AppContainer = (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )

    if (IS_SPA) createRoot(container).render(AppContainer)
    else hydrateRoot(container, AppContainer)
})

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(IS_SPA ? 'sw.js' : serviceWorkerPath)
            .then(
                () => {
                    console.info('Offline service worker successfully installed');
                },
                error => {
                    console.error('ServiceWorker registration failed: ', error);
                }
            );
    });
}